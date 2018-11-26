# Get Started
## Required Tools
 - [Nodejs](https://nodejs.org/en/download/)
 
## Installation
 - git clone https://github.com/CSCC01/Team19.git
 - cd ./Front-end
 - npm install
 - create an .env file with only CREATE_REACT_APP=${insert backend url here}. If you're running the server locally, then http://localhost:3001 would suffice.
###### Too much effort? Say no more! Our project can also be found live [here](https://greencare.netlify.com/). Running the newest version from our CI/CD scripts.

## File Structure (after src)
 - **./assets**
   - This holds any assets we might have such as videos and photos
 - **./components**
   - This holds any reusable pieces of code we have such as forms for creating specific entities like users and organizations
 - **./containers**
   - This holds any components which sole purpose is to hold other components like a barrel
 - **./pages**
   - This holds all the pages found in the application
 - **./styles**
   - This holds all our SASS styles (Matching file structure)
 - **./util**
   - This holds any resuabled javascript functions such as authentication, data fetching, and data manipulations

## Testing
Our testing for the front-end is performed manually (Sorry, Jest was an extremely non-corporative testing framework). The document can be found [here](https://docs.google.com/document/d/1vzwPTbP6IWrinz8b0ImvzVxge7ZZ13SRvpJRGovhvik/edit?usp=sharing)
