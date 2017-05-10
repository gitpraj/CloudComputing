#!/usr/bin/python3
"""Sentiment_ass1.py

Iterate through each tweet and find the sentiment for each tweet.
"""
import os
import sys
import numpy as np
import pandas as pd
from SentenceTokeniser import SentenceTokeniser
from csv import DictReader
import couchdb
from CouchDBConnect import CouchDBConnect
import core
import h5py
import pickle
import Sentiment_twitter as S


_db_handle=CouchDBConnect.connect_CouchDB()
db = _db_handle["tweets"]

def get_tweet_id(api, days_ago, query,geocode="Australia"):
    ''' Function that gets the ID of a tweet.'''
    # return an ID from __ days ago
    td = dt.datetime.now() - dt.timedelta(days=days_ago)
    tweet_date = '{0}-{1:0>2}-{2:0>2}'.format(td.year, td.month, td.day)
    # get list of up to 10 tweets
    tweet = api.search(q=query, count=10,until=tweet_date,geocode=geocode)
    return tweet[0].id

def get_text(db):
    queue = {}
    try:
        for row in db.view('senti/forSenti',
                                 wrapper=None,
                                 group_level=1):


                queue.update({row.key[0]: {}})
        for row in db.view('senti/forSenti',
                                 wrapper=None,
                                 group='true'
                                 ):
                queue[row.key[0]]['rev'] = row.key[1]
                queue[row.key[0]]['text'] = row.key[2]
    except:
        raise Exception("Failed to retrieve view: "
            + db.name
            + "/tweets/_view/forSenti\n\n")
    return queue
def iterate_doc(db):

    try:
        replies = get_text(db)
        for r in replies:
            try:
                doc = db.get(r)
                text = doc['text']
                if('sentiment' in doc) :
                   print("sentiment present")
                else :
                   text = doc['text']
                   sentiment1=S.SentimentCheck(text)
                   if(sentiment1[0][1]>0.6) :
                      s="positive"
                   elif (sentiment1[0][0]>0.6) :
                      s="negative"
                   else :
                      s="neutral"

                   doc['sentiment']=s
                   doc = db.save(doc)
                   print ("Saved")
            except:
                print("Exception1")
                pass
    except:
        print("Exception2")
        pass
def main():
  print
  _db_handle=CouchDBConnect.connect_CouchDB()
  db = _db_handle["tweets"]
  iterate_doc(db)

if __name__ == "__main__":
    main()
