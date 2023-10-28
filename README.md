# CyberWildlife Website
Website that allows users to view wifelife and share experiences. 
This website was made as a part of my Computer Science Bachelor's Degree, completed with backend and frontend technologies by myself.

## Funcionality:

The website uses HTML/CSS/Javascript with EJS for the frontend, express for the backend, and MongoDB for the database.

- Intiutive user interface and design
- Responsive
- Multiple pages
- SignUp/Login functionality
- Posting experiences with text and image upload 
- Rest API calls

## Running

For the frontend:
The pages are in a folder called "views" and their corresponding css files and resources are in folders called "Styles", "Images", and "Fonts"
The "DOM scripts" folder contains the "script.js" file that contains methods used in the ejs files

For the backend:
The "server.js" file is the main server that should be run ('nodemon server.js')
The files included in the Server folder are required by the main server
The server uploads all images to the "uploads" folder

### Testing

You will first see a signin/signup page where you can either create an account or use a pre-existing user (Youssef pass123)

## Pages

### Main Page: The website's main page where you can navigate to other pages
<img src="/WebsiteScreenshots/MainPage.jpg" alt="Image not found." width="700">

### Animal Description: Page with images and information about each animal as well as see other people's experiences; In addtition to API call to find out more information about animal.

<img src="/WebsiteScreenshots/AnimalDesc.jpg" alt="Image not found." width="700">

### About Us: General information
<img src="/WebsiteScreenshots/AboutUs.jpg" alt="Image not found." width="700">

### Sign In / Sign Up
<img src="/WebsiteScreenshots/SignInSignUp.jpg" alt="Image not found." width="700">

### Profile: Look at own and other people's information and personal experiences. In addition to custom API call.
<img src="/WebsiteScreenshots/Profile.jpg" alt="Image not found." width="700">




