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
- request: `GET /api/profile/`
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
- request: `PUT /api/profile`
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
- request: `POST /api/course`
    - content-type: `application/json`
    - body: object
        - course_code: (String) course code
        - course_name: (String) name of the class
        - password: (String) password to join the class
- response: 200
    - body: `success`
- response: 403
    - body: `Not an instructor` (if you are not an instructor)
- response: 400
    - body: `permission denied` (if you are not a mentor)
 
### Enroll Course
- description: enroll a student in a class (user has to be authenticated)
- request: `POST /api/course/:id/enroll`
    - content-type: `application/json`
    - body: object
        - password: (String) course password
- response: 200
    - body: `success`
- response: 400
    - body: `incorrect password`

### UnEnroll Course
- description: unenroll a student in a class
- request: `DELETE /api/course/:course_id/enroll`
  - content-type: `application/json`
  - body: empty
- response: 200
  - body: `success`
- response: 400
  - body: `could not find object model`
  - body: `could not find object model id`
  
## Course Modules API

### Get Module
- description: get details on a specific module in a course
- request: `GET /api/course/:id/module/:mid`
  - content-type: `application/json`
- response: 200
    - body: object (all fields of Module model)
- response: 400
    - body: `permission denied` (if you are not a mentor)
- response: 400
    - body: `invalid course id` (if course id doesn't exist)
  
### Create Module
- description: create a new module for given course
- request: `POST /api/course/:id/module/create`
    - content-type: `application/json`
    - body: object
        - name: (String) name of the module
        - description: (String) desc of the module
- response: 201
    - body: `success`
- response: 403
    - body: `Not an instructor` (if you are not an instructor)
- response: 400
    - body: `permission denied` (if you are not a mentor)
- response: 400
    - body: `invalid course id` (if course id doesn't exist)
  
### Edit Module
- description: edits module
- request: `PATCH /api/course/:id/module/:mid`
    - content-type: `application/json`
    - body: object
        - name: (String) new name
        - description: (String) new description
- response: 200
    - body: `success`
- response: 403
    - body: `Not an instructor` (if you are not an instructor)
- response: 400
    - body: `permission denied` (if you are not a mentor)
    
### Delete Module
- description: deletes the module item
- request: `DELETE /api/course/:id/module/:mid`
   - content-type: `application/json`
- response: 204
   - body: `success`
- response: 403
    - body: `Not an instructor` (if you are not an instructor)
- response: 400
    - body: `permission denied` (if you are not a mentor)
    
## Course Module Items API

### Create Module Item
- description: create a module item (either assignment or lecture)
- request: `POST /api/course/:id/module/:mid/create`
    - content-type: `application/json`
    - body: object
        - type: (String) type of the module ('ASN' or 'LEC')
        - name: (String) name of the module
        - assignment/lecture: object
            - video: (String) valid video url (if type 'LEC')
            - notes: (String) URL of notes
        - date: (String) date of module item
- response: 201
    - body: object (all fields of Module model)
- response: 403
    - body: `Not an instructor` (if you are not an instructor)
- response: 400
    - body: `permission denied` (if you are not a mentor)
  
### Edit Module Item
- description: edits module item (either assignment or lecture)
- request: `PATCH /api/course/:id/module/:mid/:pid/`
    - content-type: `application/json`
    - body: object
        - type: (String) type of the module ('ASN' or 'LEC')
        - name: (String) name of the module
        - assignment/lecture: object
            - video: (String) valid video url (if type 'LEC')
            - notes: (String) URL of notes
        - date: (String) date of module item
- response: 200
    - body: `success`
- response: 403
    - body: `Not an instructor` (if you are not an instructor)
- response: 400
    - body: `permission denied` (if you are not a mentor)
- response: 400
    - body: `invalid course/module/module item id` (if any ids don't exist)
    
### Delete Module Item
- description: deletes the module item
- request: `DELETE /api/course/:id/module/:mid/:pid/`
    - content-type: `application/json`
- response: 204
   - body: `success`
- response: 403
    - body: `Not an instructor` (if you are not an instructor)
- response: 400
    - body: `permission denied` (if you are not a mentor)
- response: 400
    - body: `invalid course/module/module item id` (if any ids don't exist)

## Comments API

### Comment create
- description: Adds a comment to a post
- request: `POST /api/user/comment/create/:object_type/:object_id/`
  - content-type: `application/json`
- response: 200
  - body: `success`
- response: 400
  - body: `could not find object type`
  - body: `could not find object id`

### Display Comments
- description: queries database for comments in order to display them in front end
- request: `GET /api/user/comment/display/:object_type/:object_id`
  - content-type: `application/json`
- response: 200
  - body: list
    - json list of comment objects
- response: 400
  - body: `could not find object type`
  - body: `could not find object id`

### Create Post
- description: creates a post for auser
- request: `POST /api/user/post/create/`
  content-type: `application/json`
- response: 200
  - body: `success`
- response: 400
  - body: `could not find object type`
  - body: `could not find object id`

### Display Post
- description: displays post from a given user
- request: `POST /api/user/post/display/:profile_id`
  content-type: `application/json`
- response: 200
  - body: `success`
- response: 400
  - body: `could not find object type`
  - body: `could not find object id`

### To like
- description: likes a post/comment for a user
- request: `PATCH /api/user/post/like/:object_type/:object_id`
  - content-type: `application/json`
- response: 200
  - body: `success`
- response: 400
  - body: `could not find object model`
  - body: `could not find object model id`

### unlike
- desctiption: unlikes a post/comment for a user
- request: `PATCH /api/user/post/unlike/:object_type/:object_id`
  - content-type: `application/json`
- response: 200
  - body: `success`
- response: 400
  - body: `could not find object model`
  - body: `could not find object model id`

### get if liked
- description: gets if a post/comment is already being liked by user
- request: `GET /api/user/post/getlike/:object_type/:object_id`
  - content-type: `application/json`
- response: 200
  - body: `success`
- response: 400
  - body: `could not find object model`
  - body: `could not find object model id`
- response: 404
  - body: `could not find object type`

## Delete Object
- description: Deletes the given object
- request: `DELETE /api/delete/:object_type/:object_id`
  - content-type: `application/json`
- response: 200
  - body: `success`
- response: 400
  - body: `could not find object model`
  - body: `could not find object model id`
- response: 401
  - body: `you do not own this`