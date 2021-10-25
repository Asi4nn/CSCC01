## General
- ~~As a registered user, I want to be able to add other users to a network to prioritise their activity on the application on my feed.~~
    - ~~**CoS**: Everytime a user adds another user to their network and their request is accepted by that user, the number of people in their network must increment by 1.~~
- As a registered user I want to see the activity and broadcasts of other users on my feed to better connect with users in my network first and other users second.
    - **CoS**: 3/5 at the beginning of the feed should be people added the network 1/5 should be posts from people outside of the network with more interaction and the remaining posts should be random.
- As a registered user I want to directly message other users on my network.
     - **CoS**: Other users should receive sent messages in their inbox along with the sender's name, avatar and the ability to click and open up their profile.
- As a registered user I would like to be able to have a calendar of all upcoming sessions/meetings/important dates so that I can easily keep track of everything. 
    - **CoS**:
- ~~As a registered user, I want to be able to edit my profile details, which includes: Profile display name, details of location, company, profile description, etc (add more later).~~
    - ~~**CoS**: The user should be able to see and edit profile details stored in the app database and can save + edit instantly.~~
- As a user, I want to be able to smoothly transfer from login to profile and classroom views.
    - **CoS**: After a user logs in, they should be able to view their profile and have button links between classroom views and profiles views
- As a user, I want my UI to be intuitive to use and navigate, but also seem aesthetically pleasing.
    - **CoS**: The styles should somewhat match the official African Impact Challenge Website, and should be intuitive for any potential users.
- ~~As a user, I want to be able to view all the classes I'm enrolled in.~~
    - ~~**CoS**: When specified, the user should see a full list of classes they are enrolled in.~~
- ~~As a user, I want a landing page that easily directs me as a new user to information about the African impact challenge or to register for their .~~
	- ~~**CoS**: A user should be able to navigate to these in one click.~~
- As a user, I want to be able to search for profile by usernames, companies and given names.
	- **CoS**: A seach query should result in a list of relevant profiles.
- As a user, I want to view posts.
	- **CoS**: Posts should be displayed in the UI and match the database entry.
- As a user, I want to create posts.
	- **CoS**: You should be able to create a post and it be reflected in the database.
## Entrepreneur
- As an entrepreneur, I want to be able to create a question or comment thread in the discussion forum by a button in the UI at a certain timestamp in the e-learning video modules to make it easier to add context to a question I may have about a video.
    - **CoS**: Using this feature should create a thread in the topic discussion forum that links back to the video at the timestamp and persists in a database.
- As an entrepreneur, I can navigate away from a page playing a video and  come back to the video resuming at the same point. 
    - **CoS**: Either navigate away from the page by clicking a link, closing the tab or browser, then open up the same video and see if it resumes from the same time. 
- As an entrepreneur, I want to be able to create events at a desired visibility to foster networking among other users.
    - **CoS**: Create an event visible to all users, then check if they can view it on their feed. Then create an event to users on your network, then check if they can view it on your feed.
- As an entrepreneur, I I want to be able to create a company profile in order to quickly share information on company related documents such as pitch decks, financials, MCs, founding team, etc.
    - **CoS**: After filling in profile details and saving/submitting/updating it, the user who created the profile as well as other users should be able to see all the inputted details on the profile.
- ~~As an Entrepreneur, I want to be able to see all the classes I'm enrolled in, and I also want to be able to enrol in classes given via link and/or password.~~
    - ~~**CoS**: Using the correct link and/or password a student account can be enrolled in a class and see all classes they are currently enrolled in.~~
- As an Entrepreneur, I want to be able to view class materials and complete any deliverables on the website.
    - **CoS**: A student should be able to view all available content in any courses they are enrolled in and complete any deliverables via either textbox/standard HTML input or file upload.
- As an Entrepreneur, I want to be able to enroll in a class via a code.
    - **CoS**: Once the code is submitted in the UI, the class should display in the list of enrolled classes.

## Mentor
- As a mentor, I want to be able to create assignments which entrepreneurs can complete and upload/submit (documents/recordings) to me so that I can create opportunities for entrepreneurs to test the skills I have been teaching them.
    - **CoS**: Assignment submissions should persist in a database and be visible to the mentor that created the assignment only.
- As a mentor, I want to be able to hold live workshops/sessions so I can teach classes in a real time environment.
    - **CoS**: The live session started by the mentor must be visible and audible to attendees.
- As a mentor, I want to be able to enable comments on course content in order for entrepreneurs to be able to ask questions/have discussions.
    - **Cos**: The instructor will have the ability to enable comments on every upload. If enabled, the enrolled students (entrepreneurs) should be able to leave comments that persist and are visible to other enrolled students.
- As a mentor, I want to be able to create classes and invite students using either their unique username or email.
    - **CoS**: A user account registered as a mentorshould be able to create new classes in which they can invite students (and maybe other teachers as secondary instructors), all classroom information should be started in the app database.

# Investor
- As an investor I want to be able to offer entrepreneurs with no funding within the African Impact Challenge pre-seed funding.
   - **CoS**: An investor should be able to see the funding status of an entrepreneur's company while veiwing their profile and should be able to make an offer if they do not have funding. The entrepreneur and investor can then connect on the social network and discuss the funding.

# Developer Stories
- ~~As a developer, I want to be able to integrate all the features from sprint 1.~~
	- ~~**CoS**: A user should be able to navigate through the website to access function pertaining to completed user stories.~~
- ~~As a developer the HTTP requests for the enrolled class listing should return a list of classes.~~
	- ~~**CoS**: UI should display a list of classes.~~
- As a developer, I want to be able to test the HTTP requests for enrolling in a class.
	- **CoS**: running a query on enrolled classes for the user should have the newly enrolled class in the result.
- As a developer, I want to be able to modify the profile styling.
	- **CoS**: Profile should be visually appealing and organized with information easy to find on a browser.
 - As a developer, I want to be able to create a profile API.
 	- **CoS**: Developer should be able to fetch profile information from the frontend via an HTTP request.
- As a developer, I want to be able to test the HTTP requests for enrolling in a class.
	- **CoS**: running a query on enrolled classes for the user should have the newly enrolled class in the result.
- As a developer, I want to be able to finalize the models.
	- **CoS**: The entire team agrees on the model schema.
- As a developer, I want to be integrate the classroom/module front-end.
	- **CoS**: The classroom works with the back-end.
- As a developer, I want to be able to refactor the profile to use React Router.
	- **CoS**: The profile should be navigable with no difference after incorporating React Router.
- As a developer, I want to use back-end data for the profile.
	- **CoS**: Profile information from each user should match with what's in the database.
- As a developer I want to be create a profile API.
	- **CoS**: Running queries should result in profile information.
- As a developer, I want to be able to finalize the models.
	- **CoS**: The entire team agrees on the model schema.
- As a developer, I want to display posts.
	- **CoS**: Posts should be displayed in the UI and match the database entry.
- As a developer, I want to link the frontend pages.
	- **CoS**: Task is done once the developer links React Native front to other relevant pages from the mentor classroom view.
- As a developer, I want to remodel the classroom back-end.
	- **CoS**: Make modules within every course. Every module requires lectures and assignments. Add endpoints for creating modules, lectures, and assignments.

