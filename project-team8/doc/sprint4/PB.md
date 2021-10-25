## General
- ~~As a registered user, I want to be able to add other users to a network to prioritise their activity on the application on my feed.~~
    - ~~**CoS**: Everytime a user adds another user to their network and their request is accepted by that user, the number of people in their network must increment by 1.~~
- ~~As a registered user, I want to be able to edit my profile details, which includes: Profile display name, details of location, company, profile description, etc (add more later).~~
    - ~~**CoS**: The user should be able to see and edit profile details stored in the app database and can save + edit instantly.~~
~~- As a user, I want to be able to smoothly transfer from login to profile and classroom views.~~
    ~~- **CoS**: After a user logs in, they should be able to view their profile and have button links between classroom views and profiles views~~
- ~~As a user, I want my UI to be intuitive to use and navigate, but also seem aesthetically pleasing.~~
    - ~~**CoS**: The styles should somewhat match the official African Impact Challenge Website, and should be intuitive for any potential users.
- ~~As a user, I want to be able to view all the classes I'm enrolled in.~~
    - ~~**CoS**: When specified, the user should see a full list of classes they are enrolled in.~~
- ~~As a user, I want a landing page that easily directs me as a new user to information about the African impact challenge or to register for their .~~
	- ~~**CoS**: A user should be able to navigate to these in one click.~~
- ~~As a user, I want to be able to search for profile by usernames, companies and given names.~~
	- ~~**CoS**: A string search query should result in a list of relevant profiles.~~
- ~~As a user, I want to view posts.~~
	- ~~**CoS**: Posts should be displayed in the UI and match the database entry.~~
- ~~As a user, I want to create posts.~~
	- ~~**CoS**: You should be able to create a post and it be reflected in the database.~~
- ~~As a user, I want to be able to delete posts.~~
	- ~~**CoS**: Entry from the database associated with the post should be removed once the delete button is pressed.~~
- ~~As a user I want to be able to import the Google calendar API and sign-in with an authorised account.~~
 	- ~~**CoS**: Entry from the database associated with the post should be removed once the delete button is pressed.~~
- ~~As a user, I want to be able to use my calendar link to display the calendar in the front-end.~~
	- ~~CoS: A link to a public calendar in the back-end should display that same calendar in the front-end.~~
## Entrepreneur
- ~~As an Entrepreneur, I want to be able to see all the classes I'm enrolled in, and I also want to be able to enrol in classes given via link and/or password.~~
    - ~~**CoS**: Using the correct link and/or password a student account can be enrolled in a class and see all classes they are currently enrolled in.~~
- As an Entrepreneur, I want to be able to view class materials and complete any deliverables on the website.
    - **CoS**: A student should be able to view all available content in any courses they are enrolled in and complete any deliverables via either textbox/standard HTML input or file upload.
- ~~As an Entrepreneur, I want to be able to enroll in a class via a password.~~
    - ~~**CoS**: Once the password is submitted in the UI, the class should display in the list of enrolled classes.~~

## Mentor
- As a mentor, I want to be able to create assignments which entrepreneurs can complete and upload/submit (documents/recordings) to me so that I can create opportunities for entrepreneurs to test the skills I have been teaching them.
    - **CoS**: Assignment submissions should persist in a database and be visible to the mentor that created the assignment only.
- ~~As a mentor, I want to be able to create classes with a password that lets students enroll.~~
    - ~~**CoS**: A user account registered as a mentorshould be able to create new classes in which they can invite students (and maybe other teachers as secondary instructors), all classroom information should be started in the app database.~~


# Developer Stories
- ~~As a developer, I want to be able to integrate all the features from sprint 1.~~
	- ~~**CoS**: A user should be able to navigate through the website to access function pertaining to completed user stories.~~
- ~~As a developer the HTTP requests for the enrolled class listing should return a list of classes.~~
	- ~~**CoS**: UI should display a list of classes.~~
- ~~As a developer, I want to be able to modify the profile styling.~~
	- ~~**CoS**: Profile should be visually appealing and organized with information easy to find on a browser.~~
 - ~~As a developer, I want to be able to create a profile API.~~
 	- ~~**CoS**: Developer should be able to fetch profile information from the frontend via an HTTP request.~~
- ~~As a developer, I want to be able to test the HTTP requests for enrolling in a class.~~
	- ~~**CoS**: running a query on enrolled classes for the user should have the newly enrolled class in the result.~~
- ~~As a developer, I want to be able to finalize the models.~~
	- ~~**CoS**: The entire team agrees on the model schema.~~
- ~~As a developer, I want to be integrate the classroom/module front-end.~~
	- ~~**CoS**: The classroom works with the back-end.~~
- ~~As a developer, I want to be able to refactor the profile to use React Router.~~
	- ~~**CoS**: The profile should be navigable with no difference after incorporating React Router.~~
- ~~As a developer, I want to use back-end data for the profile.~~
	- ~~**CoS**: Profile information from each user should match with what's in the database.~~
- ~~As a developer I want to be create a profile API.~~
	- ~~**CoS**: Running queries should result in profile information.~~
- ~~As a developer, I want to be able to finalize the models.~~
	- ~~**CoS**: The entire team agrees on the model schema.~~
- ~~As a developer, I want to display posts.~~
	- ~~**CoS**: Posts should be displayed in the UI and match the database entry.~~
- ~~As a developer, I want to link the frontend pages.~~
	- ~~**CoS**: Task is done once the developer links React Native front to other relevant pages from the mentor classroom view.~~
- ~~As a developer, I want to remodel the classroom back-end.~~
	- ~~**CoS**: Make modules within every course. Every module requires lectures and assignments. Add endpoints for creating modules, lectures, and assignments.~~
- ~~As a developer, I want to add a link to a Google Calendar to the classroom back-end.~~
	- ~~**CoS**: The link should be stored as a string in the database once the class is created.~~
- ~~As a developer, I want to be able to refactor Courses View to Typescript and use HTTPClient and stores~~
	- ~~**CoS**: CoS: Refactored code displays the same as previous~~
- As a developer, I want to be able to create endpoint for uploading assignments
	- **CoS**: Assignments documents should be stored and retrievable after.
