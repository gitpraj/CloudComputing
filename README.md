## CloudComputing
Australian City Analytics

The  basic  automated  deployment  scripts  were  designed  for  and  tested  with  the  Ubuntu  16.04 (Trusty)  image  provided  by  Nectar.  The  whole deployment process must occur with just a few commands.
We have used shell scripts and automatic virtual systems creation scripts like boto/ansible for the whole system to be up. Running the file name script_to_setup.sh,  present in the boto_ansible folder present in the repository, would create a key pair, and use the same key pair for creating 4 different VMs, one for twitter harvester, one for couchDB, one for Sentiment Analysis and the last one for the WebServer.

Command to run:
$ sh script_to_setup.sh

Then for each virtual machine created, an ansbile yml file is supposed to be run in order to install the required packages, which would then make the machine available for use. We then have to run 4 different ansible files locally on different VMs, which is present in the same folder as the previously stated script. 

$ ansible_playbook ansible_web_server.yml
$ ansible_playbook ansible_sentiment_analysis.yml
$ ansible_playbook ansible_twitter_harvester.yml
$ ansible_playbook ansible_couchDB.yml

The virtual machines will be ready, to use after running all the above scripts.


Note: The link below is for accessing the demo of the application:
Youtube         : https://youtu.be/nsmEvrRzJu8


## Machine Learning

The tweets collected by different twitter harvesters and stored in CouchDB are later analysed for sentiment analysis and gender classification. Sentiment analysis was done for both AFL and other sports data.But gender classification was done only for AFL data.

Sentiment Analysis:
Machine learning approach that is used for sentiment analysis is neural networks. 1D-Convolutional network was used for the project, because it is faster than other neural networks and we preferred a faster approach since the analysis was done for around 200k tweets. The training set used by this method is Sentiment1408,which is collection of about 1.5 million tweets.It also used a pretrained vector model by glove9(glove.6B) with about 400k words to create a embedding layer for the model before 1D convolutional layers. This is done to convert tweets  to vectors and thus making sure that similar words that are not in training set is also classified accordingly based on the glove data.A model is then made,trained and saved in the system to avoid training of the training dataset for each tweet thus saving considerable amount of time(The training of data with 3 epochs took about 6 hrs and returned 90% accuracy). Each tweet were then fed to the model to predict its class. If the negative sentiment factor is more than 0.6 then tweet is considered ‘negative’ and if the positive sentiment factor is more than 0.6 then the twitter was considered ‘positive’.Any outlier tweet is classified with ‘neutral’ sentiment.

Gender Classification:
Gender classification was done with the help of a file, listing the first name with corresponding gender.It also uses machine learning approach for predicting the gender in case the first name is unisex name or is not in list. Description and tweet text of the user is used to classify the users. The machine learning method used by the system is SVM,which helped in categorizing the user as a ‘male’, ‘female’ and ‘brand’. The training data used for the description and text was made by crowdflower.com10, which is a very extensive data set with lots of user data. The training data was tokenized ,cleaned and saved as a pickle file.And was trained using SVM. SVM model was saved and used to predict the gender  of user of each tweet. If the names list doesn’t have the name then description is used to predict the gender ,if that fails then tweet by the user is used to predict the gender.

## Database

Apache Couchdb is the focal point of simplifying the architecture of database in such a form so that it can support the Web as a open source database software quality[5]. It supports the No-Sql query on the top of unstructured database by using the JSON format to store the data specifically made to work the mapreduce and analytics functionalities. 
After the creation of the VM’s we allocated a particular VM for installing the Couchdb. A specific script was stacked to deploy by configuring on the semantics on top of it as stated in the High level design.  The scripts were streamed to deploy the database software and edit the configuration file called couch.ini for allowing that to access remotely by binding the address which creates the admin user for making the database more secure. 
The couchdb instance is initialized with the database called “tweets” for AFL and “tweets_all" for AFL and “tweets_all” for storing the data harvested from different kind of harvesters. To benchmark the quality of system the dataset was collected from the AURIN which was converted into the format of JSON file added up in the couchdb . The dataset was compared with the actual AURIN dataset with the single script running and comparing the match by showing the required data . 
The views of  CouchDB were used unlacing the tweets data for filtering based on the tags that were in the documents. The script was in action to check if the data inside the tags that could be used to implement the story. The grouping of the data is done with the call of the map function and the views output came up as abridged CouchDB that  resulted in emitting the data which is required. This helped for the  nourishment of data parsing during the call in web service and also cutting down the burden on CouchDB. The debate during the system development process was on the top of pre-refining implemented prior importing the tagged tweets inside the couchDB. The meta-data was analysed with the help of the CouchDB views as it was assumed that the approach would be more extensible, also conceding for the changes in ad-hoc manner with keywords related to the topic without the requirement of the document in CouchDB functionally revision implementation. Conclusively it increased the complexity as it passed enormous processing to the CouchDB views that ended up taking extra time for evaluating views. The CouchDB endured  with the extra burden initially, though as the size of the database incremented exponentially it directed some problems in the creation and process of the views. 

## Tweets Harvester

Tweets were collected through the Twitter API, which was accessed with the help of Python clients running on  the  VMs.  To make the harvester productive we decided to use the twitter search API through the ‘tweepy’  Python  library  to  identify  tweets  with  user  mentions,  hashtags  and  search  terms and even filter them by location i.e. Australia. For  the  analytics component this data set was then filtered to include only those with geolocation, team names, user names.

We set up the harvester in a way that there were lot of sub harvesters running parallely with a “screen” command on unix. We had setup each harvester for each team, which would harvest tweets filtering with the famous hashtags for respective teams and location and even adding a tag "team-name" to the already harvested tweet, and then storing them into couchDB on the go.  The harvesters collected data for every 6-7 days. So we ran them for just 2 weeks and collected a lot of data. 

