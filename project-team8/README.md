# Team 8

Team Members [link](https://github.com/UTSCCSCC01/project-team8/blob/main/doc/sprint0/team.md)
Team Contract [link](https://docs.google.com/document/d/19Mintco0Ew-In94CYWB1Cvhj8p7guqki75OhsafrOtQ/edit)
## Motivation
For the African Impact Challenge our solution will be focused on building an Elearning Platform. We wish to create a simple user friendly elearning platform for african entrepreneurs. Our motivation for choosing this challenge was because we feel like it would be a good challenge for our skillset.

## Technologies Used
Front-End 

- Language: Typescript
- Framework: React Native

Backend

- Language: Python
- Framework: Django
- Database: Mongodb

## Installation

This installation guide will assume a windows environment 

To setup get started we will need 

- Node [download link](https://nodejs.org/en/)
- Python [download link](https://www.python.org/)
- Mongodb [download link](https://docs.mongodb.com/manual/installation/)

After you install python and node you should automatically have `npm` and `pip` install. Run the following to ensure that you have them install on your computer

```
D:\foo\bar> npm -v
6.14.13
D:\foo\bar> py -m pip -V
pip 21.1.1 from ...
```

The project will utilize `pipenv` to manage backend python dependencies run the following to install it

```
D:\foo\bar> py -m pip install pipenv
```
To work with the front facing react native application we will need the expo-cli run the following to install it globally
```
D:\foo\bar> npm install -g expo-cli
```

Now we have the required technologies to build the project after you clone the repo run the following

```
py -m pipenv install
cd client
npm install
```
To activate the python virtual environment run `py -m pipenv shell`
To migrate all collections defined in the app to your local mongodb instance run `py manage.py migrate`



## Contribution

This project will follow standard git flow development procedure
- `main` will be the release branch 
- `develop` will be the development branch
- other branches will be feature branches to be merged to develop through a pull request

Issues and Product Backlogs are tracked through the team jira

To get started developing a feature. Branch off from the latest `develop` branch
and create a pull request back to `develop` when you are done

