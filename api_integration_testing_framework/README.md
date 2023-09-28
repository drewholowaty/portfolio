# Super Simple API Testing

## The Framework
YAML Grammar:
```
- <test name>:
    input:
        req_type: <"GET" | "POST" | "PUT" | "DELETE" | "PATCH">
        url: <url>
        body:
            key_data_type: <string | integer | float | boolean >,
            key_user_input: "#{<python-code>}"
    expected_output:
        expected_http_code: <integer>
        expected_body:
            key_data_type: <string | integer | float | boolean >
            key_list: 
                - dash signifies first item of list
                  second item
                  third item
                - If one element is listed, the checker will assume each outputted element to be identical, and will compare the actual
                output in a many to one fashion. If more than one element is listed, the checker will compare the expected and the 
                actual in a one to one fashion. 
            more_information: "all strings in the expected output section in the yaml file are treated as regular expressions"

- <second test name>:
.
.
. 
```
Dynamic code: 

Only single line expressions are supported at the current moment! Examples: "#{input('user input: )}" "#{4+5}"
Specified with `"#{<code>}"` syntax, this can be used in either the key, value, or list element in the yaml file with the following constraints:
- Code must always have a return statement
- Key: Code must only return an object with type string
- Value/list element: Code must only return an object with type list, dict, string, or any primitive type. The resulting iterables (list or dict) must conform to json syntax
<br/><br/>

Variables:

Values from the prior response body can be accessed via inline python code. Example: "#{prior_response_body[\'key\']}"

OPTIONS:

-h,&nbsp; --help

-v,&nbsp; --verbose<br/> 
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; prints out the success status of every test case. Default setting only prints when test fails

--verbose<br/> 
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; specifies file location to store cookies

--cookie-file<br/> 
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; specifies file location to store cookies

## Getting Started
This application has not been packaged yet!

1. Create a virtual environment if you wish
```
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    deactivate # deactivates python venv
```
2. Create a test case file that follows the above grammar 
3. list the test case files in the test_config.yaml file in the order in which you want them to be run
4. python3 main.py 

## Future Considerations
- -\-no-cookies: disables cookie storage in tester. Find a way to implement this with the session object, if possible
- unit test algorithm based functions
- refactor to look pretty
- complete TODOs
- improve grammar and parsing regarding inline python code. Strictly enforce return statement?
- multi line python inline code support, beyond just expressions
- check for expected cookies
