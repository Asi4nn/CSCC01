## Front End
### RootStore Class
  - path: `src/store/root.ts`
  - description: Class which encapsulates the total appstate wraps around all store class this class is injected via React Context to the root of component so all Components can access this store.
### AuthStore Class
  - path: `src/store/Auth/index.ts`
  - description: Class which encapsulates all state logic regarding User Authentications
### UIStore Class
  - path: `src/store/UI/index.ts`
  - description: Class which encapsulates all state logic regarding User Interface
### HTTPClient Class
  - path: `src/store/httpclient.ts`
  - description: Class to handle all http client request to the backend this class is contained in the store class
### HTTPMockClient Class
  - path: `src/views/mock/mockhttpclient.ts`
  - description: Mock HTTP Client to mock fake data based on previously agreed upon Contract
### Authentication Page Component
  - path: `src/views/Auth/index.tsx`
  - description: Class to handle the Authentication page view
### Profile Page Component
  - path: `src/views/Profile/index.tsx`
  - description: Class to handle the Profile page view 

## Back End
### Permissions
- path: `backend/api/permissions.py`
- description: Interacts with the API views in View.py to make sure the user accessing the API endpoints have the correct permissions.

### Serializers
- path: `backend/api/serializers.py`
- description: Interacts with the API views in View.py to transform 'python data'(dictionaries, class attributes, etc) into a format readable for front end, such as Json (and vice versa)

### URLs
- path: `backend/api/urls.py` and `backend/backend/urls.py`
- description: The middle man between front end, the backend. First the urls from backend/backend/urls are processed and then the urls from backend/api/urls is appended to those

### Models
- path: `backend/api/models.py`
- description: These are the models of all our classes which will be stored in some sort of database. Whenever a change to the models occurs, you must django migrate in order to update the database

## REST API
### Sign up API
- description: signs up and authenticates user by setting session cookie server side
- request: `POST /api/users/signup/`
  - content-type: `application/json`
  - body: object
    - password: (string) password of account
    - email: (string) email of the user (must be unique)
    - username: (string) name of the user 
- response: 200
  - body: object
    - userid: (Int) userid assigned by database
    - username: (string) username of account
- response: 409
  - body: object
    - error : `email already exist`


### Sign in API

- description: authenticates user by setting session cookie server side
- request: `POST /api/users/signin/`
  - content-type: `application/json`
  - body: object
    - password: (string) password of account
    - username: (string) username of account
- response: 200
  - body: object
    - userid: (Int) userid assigned by database
    - username: (string) username of account
- response: 401
  - content-type: `application/json`
  - body: object
    - error : `incorrect password`
- response: 404
  - content-type: `application/json`
  - body: object
    - error : `username not found`

## Profile API

### Get Profile
- description: get all user profiles for the application (paginated)
- request: `GET /api/user`
    - content-type: `application/json`
    - body: object
         - page: (Int) page in database we are retrieving
         - pagelength: (Int) page length
- response: 200
    - body: Object
         - userinfo: Array of Object
               - description: (String) description
               - username: (String) 
               - companyname: (String) new company
 
### Edit Profile
- description: edits user profile 
- request: `PATCH /api/users`
   - content-type: `application/json`
   - body: object
      - description: (String) new description
      - username: (String) new username
      - companyname: (String) new company
- response: 200
   - body: `success`

### Add user to network
- description: adds a given user to the logged in users network
- request: `POST /api/user/network/add`
  - content-type: `application.json`
  - body: object
    - username: (String) the username of the user the logged in user is attempting to add
- response: 200
  - body: `success`
- response: 400 
  - body: `The user you are trying to add does not exist`

### Remove user from network
- description: removes a give user to the logged in users network
- request: `POST /api/user/network/remove`
  - content-type: `application.json`
  - body: object
    - username: (String) the username of the user the logged in user is attempting to remove
  - response: 200
    - body: `success`
  - response: 400
    - body: `The user you are trying to remove does not exist`

## Course API

### Get All Courses
- description: get all courses that belong to the user that are either created or enrolled in (paginated)
- request: `GET /api/course`
  - content-type: `application/json`
- response: 200
    - body: object
        -  classes: Array of Object
            - course_name : (String) name of the class
            - course_code: (String) course code
    
### Get Course
- description: get a course by id
- request: `GET /api/course/:id`
  - content-type: `application/json`
- response: 200
    - body: object (all fields of Course model excluding password, professor_id, and course_id)
- response: 404
    - Not found when id doesn't many any course object
    
### Create Course     
- description: create a class by an instructor (user has to be authenticated)
- request: `POST /api/class`
    - content-type: `application/json`
    - body: object
        - course_code: (String) course code
        - name: (String) name of the class
        - password: (String) password to join the class
- response: 200
    - body: `success`
- response: 403
    - body: `Not an instructor` (if your not a instructor)
- response: 400
    - body: `permission denied` (if you are not a mentor)
 
### Enroll Course
- description: enroll a student in a class (user has to be authenticated)
- request: `POST /api/course/:id/enroll`
  - content-type: `application/json`
- response: 200
    - body: `success`

## Comments API

### Display Comments
- description: queries database for comments in order to display them in front end
- request: `GET /api/user/comment/display/model_type/model_id` (model_type and model_id are parameters to the search)
  - content-type: `application/json`
- response: 200
  - body: list
    - json list of comment objects
- response: 400
  - body: `could not find model type`
  - body: `could not find model id`
### Comment on post
- desctiption: Adds a comment to a post
- request: `POST /api/user/comment/create/post`
  - content-type: `application/json`
- response: 200
  - body: `success`
- response: 400
  - body: `could not find model type`
  - body: `could not find model id`
### Comment on course content
- descroption: Adds a comment to course content
- request: `POST /api/user/comment/create/coursecont`
  - content-type: `application/json`
- response: 200
  - body: `success`
- response: 400
  - body: `could not find model type`
  - body: `could not find model id`

### Create a post on profile
- description: Adds a post to a users profile
- request: `POST /api/user/post/create
  - content-type: `application/json`
- response: 200
  - body: `success`
- response: 400
  - body: `The profile of the user you are trying to remove does not exist`

### Display posts on profile
 - description: displays posts on a users profile
 - request: `GET /api/user/post/display/model_type/model_id` (model_type and model_id are parameters to the search)
   - content-type: `application/json`
 - response: 200
   - body: `success`
 - response: 400
   - body: `could not find model type`
   - body: `Could not find model id`
