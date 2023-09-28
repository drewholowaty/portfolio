import yaml
import os
import sys
import requests
import json
import re
import argparse 
import signal

# global store
prior_response_body = {}

# code to enable command argument flags
parser = argparse.ArgumentParser(
    prog='testapi',
    description='Given an HTTP request input, this program compares the expected output to the actual output of an API call.',
    epilog=''
)
parser.add_argument('-v', '--verbose', 
                    action='store_true', 
                    default=False,
                    help='sets verbose to true, default value is false'
                )

parser.add_argument('--cookie-file',
                    default=None,
                    help='specifies file location to store cookies'
                )

args = parser.parse_args()

# gracefull handles ctrl-c to quit program
def handler(signum, frame):
    print() # prints newline
    sys.exit(0)

signal.signal(signal.SIGINT, handler)

# checks for "#{}" pattern, runs associated python code, and inserts it into test object. 
def run_python_code(obj):
    stack = [obj]

    # iteratively traverse current test, search for "#{}" pattern, run python code 
    while stack:
        current = stack.pop()
        if isinstance(current, dict):
            for key in current:
                # first checks value for "#{}" pattern, then key. Enforces object type constraints
                if isinstance(current[key], str) and re.match(r'#\{.+\}', current[key]):
                    python_code = 'return_obj = ' + re.search(r'#{([^}]+)}', current[key]).group(1)
                    exec(python_code, globals())
                    potential_new_value = globals().get('return_obj')
                    # TODO: check potential_new_value type
                    current[key] = potential_new_value 
                if isinstance(key, str) and re.match(r'#\{.+\}', key):
                    python_code = 'return_obj = ' + re.search(r'#{([^}]+)}', key).group(1)
                    exec(python_code, globals())
                    potential_new_key = globals().get('return_obj')
                    if isinstance(potential_new_key, str):
                        current[potential_new_key] = current[key]
                        del current[key]
                        key = potential_new_key
                    else:
                        print("ERROR: Return type for python code in key must be string")
                        sys.exit(0)

                stack.append(current[key])

        elif isinstance(current, list):
            for i in range(len(current)):
                if isinstance(current[i], str) and re.match(r'#\{.+\}', current[i]):
                    python_code = 'return_obj = ' + re.search(r'#{([^}]+)}', current[i]).group(1)
                    exec(python_code, globals())
                    potential_new_item = globals().get('return_obj')
                    # TODO: check potential_new_item type
                    current[i] = potential_new_item
                stack.append(current[i])
                

# check actual res against expected. Returns true if comparison fails
def compare_expected_response(expected, res_status_code, res_body):
    if expected['expected_http_code'] == res_status_code:
        expected_body = expected['expected_body']

        stack = [(expected_body, res_body)]
        while stack:
            exp, act = stack.pop()
            if isinstance(exp, dict) and isinstance(act, dict):
                # compare keys with eachother, add values to stack
                if len(exp.keys()) == len(act.keys()):
                    for exp_key, act_key in zip(exp.keys(), act.keys()):
                        if not re.match(exp_key, act_key): 
                            return True
                        stack.append((exp[exp_key], act[act_key]))
                else:
                    return True
            elif isinstance(exp, list) and isinstance(act, list):
                # if expected list is 1, then do one to many comparison, else, compare each element of exp and act
                if len(exp) == 1:
                    stack.extend(zip(exp[0] * len(act), act))
                else:
                    if len(exp) != len(act):
                        return True
                    stack.extend(zip(exp, act))
            else:
                if type(exp) == type(act):
                    # only need to check one of the values as prior lined assures equality of type
                    if isinstance(exp, str):
                        if not re.match(exp, act):
                            return True
                    else:
                        if exp != act:
                            return True
                else:
                    return True
        # if entire stack is exhausted without return, then expected and actual match
        return False
    else:
        return True


def main():
    try:
        with open('test_config.yaml', 'r') as file:
            filename_list = yaml.safe_load(file)
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        sys.exit(0)
    except yaml.YAMLError as e:
        print(f"YAML Parsing Error: {e}")
        sys.exit(0)

    # intitializes session object so that cookies may persist across tests/requests 
    session = requests.Session()
    cookie_dict = {}
    if(args.cookie_file):
        try:
            with open(args.cookie_file,  'r') as file:
                cookie_dict = json.load(file)
        except FileNotFoundError:
            # if file not found, pass, as this implies empty cookie_dict
            pass

    # iterate over cases
    for filename in filename_list:
        # parses yaml file
        try:
            with open(filename, 'r') as file:
                case = yaml.safe_load(file)
        except FileNotFoundError:
            print(f"File not found: {file_path}")
            sys.exit(0)
        except yaml.YAMLError as e:
            print(f"YAML Parsing Error: {e}")
            sys.exit(0)

        # iterate over tests in case
        for test in case:
            # extracts request data from test object
            test_name = list(test.keys())[0]
            req_type = test[test_name]['input']['req_type']
            if req_type not in ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE']:
                print('ERROR: ' + req_type + ' is an invalid request type')
                sys.exit(0)

            # replaces all "#{<python code>}" with return object of executed <python code>
            run_python_code(test[test_name])

            # builds request
            req_body = test[test_name]['input']['body']
            if req_body is not None:
                req_body = json.dumps(req_body)

            req = requests.Request(
                    req_type,
                    test[test_name]['input']['url'],
                    data=req_body,
                    headers={
                        'Content-Type': 'application/json'
                    },
                    cookies=cookie_dict
                )

            prepped = session.prepare_request(req)

            # sends request
            try:
                res = session.send(prepped)
            except Exception as e:
                print(e)
                sys.exit(0)

            # parse res body
            try:
                res_body = res.json()
                prior_response_body.update(res_body)
            except requests.exceptions.JSONDecodeError:
                #TODO: handle other content types besides application/json
                res_body = res.text

            # since Python's Session object is not working as expected, manually store cookies in dictionary
            for c in res.cookies:
                cookie_dict[c.name] = c.value

            if(args.cookie_file):
                with open(args.cookie_file, 'w') as file:
                    json.dump(cookie_dict, file)

            # compare expected and actual output. If they do not match, true is returned
            fail = compare_expected_response(test[test_name]['expected_output'], res.status_code, res_body) 
                
            if(fail):
                print("TEST: {}. FAILED.".format(test_name))
                print("Expected: \n{}\n{}\n".format(
                    test[test_name]['expected_output']['expected_http_code'], test[test_name]['expected_output']['expected_body']
                ))
                print("Actual: \n{}\n{}\n".format(res.status_code, res_body))
                sys.exit(0)

            if(args.verbose):
                print("TEST: {}. PASSED.".format(test_name))
                print("Expected: \n{}\n{}\n".format(
                    test[test_name]['expected_output']['expected_http_code'], test[test_name]['expected_output']['expected_body']
                ))
                print("Actual: \n{}\n{}\n".format(res.status_code, res_body))


main()

