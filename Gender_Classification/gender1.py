"""gender1

Function to find the gender through description and text
"""
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.svm import LinearSVC
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
from SentenceTokeniser import SentenceTokeniser
from csv import DictReader
from pathlib import Path
import h5py
import pickle
import re

def checkDescription(text) :
"""Function to  find the gender based on the description"""


    labels=[]
    train=[]
    des=[]
    file = Path("gender.pickle")
    if(!file.exists()) :
        # Retrieve  text and labels for training
        with open("gender-classifier-DFE-791531.csv",encoding="latin-1") as f:
                    for row in DictReader(f):
                        label= row["gender"]
                        labels.append([label])
                        train.append(row["description"])
        clean_description = []
        for i in range( 0, len(train)):
                clean_description.append(" ".join(SentenceTokeniser.review_to_wordlist(train[i], True)))
                print(i)
        mlb = MultiLabelBinarizer()
        Y = mlb.fit_transform(labels)
        with open('mlb.pickle', 'wb') as f:  # Python 3: open(..., 'wb')
               pickle.dump(mlb, f)

        print(labels)
        classifier = Pipeline([
            ('vectorizer', CountVectorizer()),
            ('clf', OneVsRestClassifier(LinearSVC()))])
        classifier.fit(clean_description, Y)
        # Save the classifier as pickle 
        with open('gender.pickle', 'wb') as f:  # Python 3: open(..., 'wb')
               pickle.dump(classifier, f)

    des.append(" ".join(SentenceTokeniser.review_to_wordlist(text, True)))
    # Load the classifier from pickle file
    with open('gender.pickle','rb') as f:  # Python 3: open(..., 'rb')
           classifier = pickle.load(f)
    predicted = classifier.predict(des)
    with open('mlb.pickle','rb') as f:  # Python 3: open(..., 'rb')
           mlb = pickle.load(f)
    all_labels = mlb.inverse_transform(predicted)
    try :
       return(all_labels[0][0])
    except :
       return "None"

def checkTweet(text) :
"""Function to  find the gender based on the tweet"""

    labels=[]
    train=[]
    des=[]
    file = Path("gendertext.pickle")
    if(!file.exists()) :
        # Retrieve  text and labels for training
        with open("gender-classifier-DFE-791531.csv",encoding="latin-1") as f:
                    for row in DictReader(f):
                        label= row["gender"]
                        labels.append([label])
                        train.append(row["text"])
        clean_text = []
        for i in range( 0, len(train)):
                clean_text.append(" ".join(SentenceTokeniser.review_to_wordlist(train[i], True)))
                print(i)
        mlb = MultiLabelBinarizer()
        Y = mlb.fit_transform(labels)
        with open('mlb.pickle', 'wb') as f:  # Python 3: open(..., 'wb')
               pickle.dump(mlb, f)

        classifier = Pipeline([
            ('vectorizer', CountVectorizer()),
            ('clf', OneVsRestClassifier(LinearSVC()))])
        # Fit the data using the classifier
        classifier.fit(clean_text, Y)
        #  Save classifer as pickle file
        with open('gendertext.pickle', 'wb') as f:  # Python 3: open(..., 'wb')
               pickle.dump(classifier, f)

    des.append(" ".join(SentenceTokeniser.review_to_wordlist(text, True)))

    # Load  classifer saved  as pickle file 
    with open('gendertext.pickle','rb') as f:  # Python 3: open(..., 'rb')
           classifier = pickle.load(f)
    # Predict class
    predicted = classifier.predict(des)
    with open('mlb.pickle','rb') as f:  # Python 3: open(..., 'rb')
           mlb = pickle.load(f)
    all_labels = mlb.inverse_transform(predicted)
    try :
       return(all_labels[0][0])
    except :
       return "None"
