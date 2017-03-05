# Web Project Workflows
This project is an example of workflow management using Gulp.js, Git, and Browserify

# Installing
Run ```> npm install --only=development```

# Start Gulp
Run ```> gulp```
This will start up a web server at http://localhost:8080 and begin watching for changes on html, json, coffeescript, javascript, sass, and image files.

# Dev Depencies
The following node modules are dependencies for this project:

## Gulp
gulp: used for task automation and managing the workflow
When starting up gulp, the default gulp workflow task is set to watch for changes to the following:

###HTML files: 'Builds/development/*.html'
* Will reload the webserver page when html is modified
* In a production environment, changes to html files will cause them to be minified and saved to the production directory

###JSON files: 'Builds/development/js/*.json'
* Will reload the webserver page when json is modified
* In a production environment, changes to the json files will crush them and store them to their production directory

###Coffeescript files:
* Runs the coffee task which grabs the files from 'components/coffee/*.coffee', compiles them, and saves them to the 'components/scripts' directory

###Javascript files:
* Runs the js task which grabs the files from 'components/scripts', concatenates them into a single script.js file, minifies the js (if running in a production environment), stores the script.js file in the appropriate js output directory (production/js or development/js depending on the environment), then reloads the webserver page

###SASS files:
* Runs the compass task which grabs the 'components/sass/style.scss' file and compiles it.  It saves to 'development/css/style.css' in nested format style. In the production environment, the file is formatted to a compressed style and saved to 'production/css/style.css'

###Image files:
* When working in a production environment, images within subdirectories of the 'development/images' directory will be optimized upon modification and saved to the 'production/images' folder, then the webserver page will be reloaded


## SASS
### gulp-sass-lint:
* Used for validation of SASS, run ```> gulp sassLint```

# Production
Modify the environment variable within gulpfile.js to specify whether or not you want to use the ```process.env.NODE_ENV``` variable or manually set it to ```development``` or ```production```.  Setting the environment to production will produce minified, compressed, and optimized versions of your scripts, css, and images.
