"""python_couchdb.py
Funtion to harvest twitter data for AFL data
"""

import tweepy
from tweepy import OAuthHandler
import json
import datetime as dt
import time
import os
import sys
import couchdb
from tweepy.utils import import_simplejson
from CouchDBConnect import CouchDBConnect
import core

"""
 Python 3 and tweepy version 3.5.0. are used
"""



def load_api():
    ''' Function that loads the twitter API after authorizing the user. '''
    args = core.config('twitter','OAuth')

    consumer_key = args['consumer_key']
    consumer_secret = args['consumer_secret']
    access_token = args['access_token']
    access_secret = args['access_secret']
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_secret)
    # load the twitter API via tweepy
    return tweepy.API(auth)


def tweet_search(api, query, max_tweets,geocode,since_id,max_id=-1):
    ''' Function that takes in a search string 'query', the maximum
        number of tweets 'max_tweets'.
        It returns a list of tweepy.models.Status objects. '''

    searched_tweets = []
    while len(searched_tweets) < max_tweets:
        remaining_tweets = max_tweets - len(searched_tweets)
        try:
            if(max_id== -1) :
                td = dt.datetime.now() - dt.timedelta(days=0)
                tweet_date = '{0}-{1:0>2}-{2:0>2}'.format(td.year, td.month, td.day)
                # get list of up to 10 tweets
                new_tweets = api.search(q=query, count=remaining_tweets,geocode=geocode,until=tweet_date)

            else :
                new_tweets = api.search(q=query, count=remaining_tweets,geocode=geocode,max_id=max_id,since_id=since_id)
            print('found', len(new_tweets), 'tweets')
            if not new_tweets:
                print('no tweets found')
                break
            searched_tweets.extend(new_tweets)
        except tweepy.TweepError:
            print('exception raised, waiting 15 minutes')
            print('(until:', dt.datetime.now() + dt.timedelta(minutes=15), ')')
            time.sleep(15 * 60)
            break  # stop the loop
    return searched_tweets


def write_tweets(tweets):
    ''' Function that appends tweets to couchdb. '''

    json = import_simplejson()
    _db_handle=CouchDBConnect.connect_CouchDB()
    db = _db_handle["tweets"]
    search_phrases = ['AFL']
    dtweet={}
    for tweet in tweets:

            dtweet= json.dumps(tweet._json)
            store_tweet(db,dtweet)

def store_tweet(db,dtweet) :
    """Tweet as Dict"""
    try:
        doc = json.loads(dtweet)
        doc.update({'_id': doc['id_str']})
        doc.update({'topic' : 'AFL'})
    except KeyError:
        print(
            "Warning: store_tweet() called, but tweet input "
            + "parameter does not contain an id_str."
        )
        return None
    if not isinstance(doc, dict):
        print(
            "Warning: store_dict() called, but doc input parameter"
            + " is not a dict."
        )
        return None
    # Attempt to save document to CouchDB
    try:
        print("Stored")
        response = db.save(doc)
    # If the _id already exists
    except couchdb.http.ResourceConflict as e:
        print(
            "Warning: The doc (_id: "
            + doc['_id']
            + ") is already exists "
        )

        print(
            "Overwriting doc (_id: "
            + doc['_id']
            + ")"
        )
def get_tweet_id(api, days_ago, query,geocode="Australia"):
    ''' Function that gets the ID of a tweet. This ID can then be
        used as a 'starting point' from which to search. The query is
        required and has been set to a commonly used word by default.
        The variable 'days_ago' has been initialized to the maximum
        amount we are able to search back in time (9).'''
    # return an ID from __ days ago
    td = dt.datetime.now() - dt.timedelta(days=days_ago)
    tweet_date = '{0}-{1:0>2}-{2:0>2}'.format(td.year, td.month, td.day)
    # get list of up to 10 tweets
    tweet = api.search(q=query, count=10,until=tweet_date,geocode=geocode)
    # return the id of the first tweet in the list
    return tweet[0].id

def get_replies(db):
    """Retrieves a list of reply-to's that need to be
    downloaded.
    """
    queue = {}
    i=0
    print("get_replies",db.view('replies/replies'))
    try:
        for row in db.view('replies/replies',
                                 wrapper=None,
                                 group_level=1):
            i=i+1
            print(i)
            if (row.value == 1):
                queue.update({row.key[0]: {}})
        for row in db.view('replies/replies',
                                 wrapper=None,
                                 group='true'):
            if row.key[0] in queue:
                queue[row.key[0]]['reply'] = row.key[1]
                queue[row.key[0]]['reply_user'] = row.key[2]
    except:
        print("Error")
    return queue
def iterate_replies(db,db2,api):
    """This method downloads tweets that tweets in our database
    have replied to.
    """
    try:
        replies = get_replies(db2)
        for r in replies:
            try:
                tweet = api.get_status(r)
                reply = replies[r]['reply']
                reply_user = replies[r]['reply_user']
                print("Store")
                dtweet= json.dumps(tweet._json)
                store_tweet(db,dtweet)
            except:
                print("Exception1")
                pass
    except:
        print("Exception2")
        pass
def main():
    ''' This is a script that continuously searches for tweets
        that were created over a given number of days. The search
        dates and search phrase can be changed below. '''

    _db_handle=CouchDBConnect.connect_CouchDB()
    db2=_db_handle["tweets"]
    db = _db_handle["tweets"]
    search_phrases = ['#AFLW', 'AFLW', '#aflw', 'aflw', '@BulldogsW', '@CollingwoodFCW', '@lionsaflw']

    time_limit = 1.5  # runtime limit in hours
    max_tweets = 100  # number of tweets per search (will be
    # iterated over) - maximum is 100
    min_days_old, max_days_old = 0, 7  # search limits e.g., from 7 to 8
    # gives current weekday from last week,
    # min_days_old=0 will search from right now

    Australia = '-25.482951175355307,135.615234375,2500km'

    api = load_api()
    iterate_replies(db,db2,api)
    if(False):
        for search_phrase in search_phrases:
            since_id="602100932839481345"
            json_file="json_file_"+search_phrase+".json"
            print('Search phrase =', search_phrase)

            ''' tweet gathering loop  '''
            start = dt.datetime.now()
            end = start + dt.timedelta(hours=time_limit)
            count = 0
            exitcount = 0
            while dt.datetime.now() < end:
                count += 1
                print('count =', count)
                # collect tweets
                try:
                    with open(json_file, 'r') as f:
                        lines= f.readlines()
                        max_id = json.loads(lines[-1])['id']
                        print('Searching from the bottom ID in file ', max_id)
                except FileNotFoundError:
                    max_id = -1
                tweets= tweet_search(api, search_phrase, max_tweets,geocode=Australia,since_id=since_id,max_id=(max_id-1))
                # write tweets to couchdb in JSON format

                if tweets:
                    write_tweets(tweets)
                    with open(json_file, 'w') as f:
                        for tweet in tweets:
                            json.dump(tweet._json, f)
                            f.write('\n')
                    exitcount = 0
                else:
                    exitcount += 1
                    if exitcount == 3:
                        if search_phrase == search_phrases[-1]:
                            sys.exit('Maximum number of empty tweet strings reached - exiting')
                        else:
                            print('Maximum number of empty tweet strings reached - breaking')
                            break


if __name__ == "__main__":
    main()
