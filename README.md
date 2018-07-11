# RA Chicago Events Scraper
Have you ever wanted a one-stop shop just to see house/techno events for the Chicago area?  I know, right? Resident Advisor is an awesome resource for that but they also have news articles, release information, and a whole bunch of other information.  What if you could JUST get event listings? Maybe allow you to save events you're interested in?

## So, what is this?

This is a straight-forward web app that scrapes event listings from the Resident Advisor events page for the Chicago area. Events are re-displayed in simple tiles and allow users to save events. Once events are saved, they can add a note about an event, if they choose to.

## How to use it:
- Go to the webpage: https://enigmatic-stream-99192.herokuapp.com/
- Click on `SCRAPE NEW EVENTS` in the nav bar to retrieve new event listings
- New event listings will appear as tiles below
- If you want to save an event, click on the `save event` yellow button on that event tile. The event will now live in the `Saved Events` section.
- To view your saved events, click on the `Saved Events` section of the navbar. In there you will see a list of all the events you saved.
- To save a note for an event, click on the `Add Note` button on the event tile. A pop-up appears and allows you to write a note and save it to the event. 

## Screenshot:

![Home Page](https://github.com/bcimbali/news-scraper/blob/master/public/assets/All_Events.png?raw=true)

## How to Install and Run:
- `git clone` the repo
- Run `npm install` to get all dependencies
- If you don't have MongoDB installed, make sure to install it now: https://docs.mongodb.com/manual/installation/
- In a new terminal window, type `mongod` to start your mongo server
- Go to `localhost:3000` in your web browser

## Built With:
- Javascript
- jQuery
- CSS
- HTML
- Express
- Cheerio
- MongoDB
- Mongoose
