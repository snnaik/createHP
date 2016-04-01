
### INSTALLATION
In your terminal, navigate to the directory where you'd like to copy this repo. Then issue the following commands:
* `git clone https://github.com/snnaik/createHP.git`
* `cd createHP`
* `npm install`

### HOW TO USE
#### 1. Generate HTML boilerplate for Homepage
This task generates a complete HTML page with the necessary styles and foundation layout for all of your sliced images. It runs on these image file types: `png, jpg, jpeg, gif`. Use the following command to run this task:
* `grunt template --folder=folder_name [--floater=1] [--alt=1]`

##### Requirements
* There must be an `images` folder that contains all the images in the correct order in which they will appear on the page.
  * E.g. say there are **5** images in total on the page as follows:
    1. top banner 960px `img_name_01.jpg`
    2. hero image 960px `img_name_02.jpg`
    3. kids sale 480px `img_name_03.jpg`
    4. shoes sale 480px `img_name_04.jpg`
    5. stay connected 960px `img_name_05.jpg`
  * The files **MUST** be named in such a way that when they are sorted in ascending order they match the layout of the page from top to bottom.
  * If, for example, in the above scenario, file #4 is named `img_name_05.jpg` and file #5 is named `img_name_04.jpg`, the task will throw a warning that images are not sliced correctly because `img_name-03.jpg` (480px) and `img_name-04.jpg` (960px) don't add up to 960px.

##### Options
* Specify the `floater` parameter if there is a floating side ad on the homepage.
  * This parameter requires an image file, the name of which begins with the text `floater`
* Specify the `alt` parameter if there is an excel sheet containing the alt text for images
  * This parameter requires an `altsheet.xlsx` excel file. (See an example file in the `Sample` folder above)
  * The excel file must contain:
    * file names of all images in an ascending order in **column A**,
    * corresponding alt text for images in **column B**.
  * The above information must be in the first sheet named `Sheet1`.

#### 2. Update links and coremetrics and check for spelling errors
This task updates links based on pre-defined criteria for various types of links. It adds necessary coremetrics to links. It optimizes image files and reduces file size, wherever possible. And it performs a spell-check on all `alt` text. Use the following command to run this task:
* `grunt reformat --folder=folder_name`
