/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

/*var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);
*/

var DialogOptions = {
    Fibonacci: 'Fibonacci',
    Square : 'Square',
    Prime : 'Prime',
    Lychrel: 'Lychrel'   
};

var bot = new builder.UniversalBot(connector, function(session){ 
    session.send('Welcome to Number Bot Deluxe!  type !commands for a list of special commands')
    //session.beginDialog('Commands');
    session.beginDialog('Start'); 
});

bot.dialog('Start', [
    function (session) {
            builder.Prompts.number(session, 'Whats your favorite number between 0 and 200?');
    },
    function (session, results) {
        session.userData.number = results.response;
        console.log( 'User entered: %d', session.userData.number );
        if( session.userData.number > 200 || session.userData.number < 0 ) {
            session.send('That number is not between 0 and 200, Lets try again shall we!');
            return session.beginDialog('Start');
        }
        session.beginDialog('Learn'); 
    }
]).triggerAction({
    matches: [/start/i, /new/i]
});

bot.dialog('Learn', [
    function (session) {
        builder.Prompts.choice(
            session,
            'What do you want to learn about your number?',
            [DialogOptions.Fibonacci, DialogOptions.Square, DialogOptions.Prime, DialogOptions.Lychrel],
            {
                maxRetries: 1,
                retryPrompt: 'Not a valid option, choose from the list before, or use !commands'
            }
        );
    },
    function (session, results) {
        // continue on proper dialog
        //var selection = results.response.entity;
        switch (results.response.entity) {
            case DialogOptions.Fibonacci:
                session.beginDialog('Fibonacci');
                break;
            case DialogOptions.Square:
                session.send('The square of %d is %d', session.userData.number, (session.userData.number*session.userData.number) );
                break;
            case DialogOptions.Prime:
                session.beginDialog('Prime');
                break;
            case DialogOptions.Lychrel:
                session.beginDialog('Lychrel');
                break;               
            default:        
        }
        session.beginDialog('Learn');            
    }
]);
	
bot.dialog('Fibonacci', require('./fibonacci'));
bot.dialog('Prime', require('./prime'));
bot.dialog('Lychrel', require('./lychrel'));
  
    
// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});


// Create your bot with a function to receive messages from the user
/*var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);

bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, "Hello... What's your name?");
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?"); 
    },
    function (session, results) {
        session.userData.coding = results.response;
        builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Got it... " + session.userData.name + 
                    " you've been programming for " + session.userData.coding + 
                    " years and use " + session.userData.language + ".");
    }
]);
*/
