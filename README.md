==========================================STEP#1: Create IAM User=======================================
1. Login to AWS Console
2. Go to IAM
3. Click on users under access management
4. Click on add users 
5. Enter User Name for example :- ServerlessUser
6. Check the => Access key - Programmatic access
7. Click on next Permission Button
8. Click on Attach existing policies directly
9. Check the => AdministratorAccess for full access
10. Click Next  Tag: Button
11. Click on Next Review: Button
12. Click on Create User : Button
13. Download CSV File
14. Keep safe download CSV File for future use


===================================STEP#2: Setup IAM User with Serverless Application====================
1. Install Serverless

    npm install -g serverless 

2. Configure IAM User With Serverless

    serverless config credentials --provider aws --key xxxxxxxxxxxxxxxxxxxxxx --secret xsxsxsxsxsxsxsxsxsxsxsxxsxsxsx --profile ServerlessUser

3. Deploy serverless application

    sls deploy


Note: Profile name should be ServerlessUser else change same in serverless.yml file
Note: Get the urls and hit those with postmen

POST /signup:
    Request Body:
        Name - STRING
        UserType - STRING:ENUM => [TEAM_LEAD / TEAM_MEMBER]
        Username: STRING
        Password: STRING

POST /signin:
    Request Body:
        Username:STRING
        Password:STRING

    Response:
        - Get the token from response and use it for authorization as a Bearer token

Later use your api with required arguments

- lambdas:
    - endpoints: API Handlers
    - commons: utilities
    - schema-validators: validations
- resources: AWS Resources common utility code
- package.json: nodejs project configuration file
- serverless.yml: serverless configuration file
- webpack.config.js: webpack configuration file


- Feel free to reach out on below contact details for any info:
    - Author: Lalit Pareek
    - Mobile: 9694609451
    - Email: pareeklalit08@gmail.com

==============================================================THANK YOU========================================================
