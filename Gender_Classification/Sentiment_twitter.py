import os
import sys
import numpy as np
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.utils import to_categorical
import pandas as pd
from SentenceTokeniser import SentenceTokeniser
from keras.preprocessing import sequence
from keras.optimizers import SGD, RMSprop, Adagrad
from keras.utils import np_utils
from keras.models import Sequential,Model
from keras.layers.core import Dense, Dropout, Activation,Flatten
from keras.layers.embeddings import Embedding
from keras.layers.recurrent import LSTM, GRU
from keras.layers.convolutional import Conv1D,MaxPooling1D
from keras.layers import Input
from keras.datasets import imdb
from keras import backend as K
from keras.models import model_from_json
from csv import DictReader
import h5py
import pickle

MAX_SEQUENCE_LENGTH = 1000
MAX_NB_WORDS = 50000
EMBEDDING_DIM = 100
VALIDATION_SPLIT = 0.2
RUN = False
# first, build index mapping words in the embeddings set
# to their embedding vector

def main() :
    if(RUN) :
        print('Indexing word vectors.')

        embeddings_index = {}
        f = open('glove.6B.100d.txt')
        for line in f:
            values = line.split()
            word = values[0]
            coefs = np.asarray(values[1:])
            embeddings_index[word] = coefs
        f.close()
        print('Found %s word vectors.' % len(embeddings_index))

        # train = pd.read_csv("Sentiment Analysis Dataset.csv", header=0, \
        #                     , quoting=3
        train=[]
        labels=[]
        with open("Sentiment Analysis Dataset.csv") as f:
                    for row in DictReader(f):
                        label= int(row["Sentiment"])
                        labels.append(label)
                        train.append(row["SentimentText"])

        clean_train_reviews = []
        for i in range( 0, len(train)):
                clean_train_reviews.append(" ".join(SentenceTokeniser.review_to_wordlist(train[i], True)))
                print(i)
        with open('reviews.pickle', 'wb') as f:  # Python 3: open(..., 'wb')
               pickle.dump(clean_train_reviews, f)
        with open('reviews.pickle','rb') as f:  # Python 3: open(..., 'rb')
               clean_train_reviews = pickle.load(f)
        tokenizer = Tokenizer(num_words=MAX_NB_WORDS)
        tokenizer.fit_on_texts(clean_train_reviews)
        sequences = tokenizer.texts_to_sequences(clean_train_reviews)
        word_index = tokenizer.word_index
        test_review=[]
        text = "An American paramedic working for European security watchdog OSCE's monitoring mission in eastern Ukraine was killed and two others were injured on Sunday when their vehicle struck a mine, triggering a U.S. call for a transparent, timely investigation.The Organization for Security and Cooperation in Europe (OSCE) said the killing was the first death of one of its members while on patrol in Ukraine, where more than 700 international observers help report on a simmering conflict that has deeply strained relations between Russia and the West.A 2015 ceasefire between Ukraine and Russian-backed separatists in the eastern part of the country is regularly violated, and Washington cites the conflict as a key obstacle to improved relations between Russia and the United States.U.S. State Department spokesman Mark Toner said the killing underscored the increasingly dangerous conditions under which the OSCE mission operated, including grappling with access restrictions, threats, and harassment.The United States urges Russia to use its influence with the separatists to allow the OSCE to conduct a full, transparent, and timely investigation, Toner said.U.S. Secretary of State Rex Tillerson also spoke about the incident on Sunday with Ukrainian President Petro Poroshenko, who offered his condolences.This tragic incident makes clear the need for all sides - and particularly the Russian-led separatist forces - to implement their commitments under the Minsk agreements absimmediately, Toner said.The Minsk peace agreement, brokered by France and Germany and signed by Russia and Ukraine in February 2015, calls for a ceasefire, the withdrawal of heavy weapons from the front line and constitutional reform to give eastern Ukraine more autonomy.But since the deal the sides appear stuck in a stalemate broken periodically by sharp resurgences of fighting that Kiev and the Kremlin accuse each other of instigating.Tillerson told Poroshenko that although Washington wanted better ties with Moscow, Russia’s actions in eastern Ukraine remain an obstacle, the State Department said."
        text="He killed many people"
        test_review.append(" ".join(SentenceTokeniser.review_to_wordlist(text, True)))
        print("adfad" ,test_review)
        # tokenizer = Tokenizer(num_words=MAX_NB_WORDS)
        # tokenizer.fit_on_texts(test_review)
        test_sequences = tokenizer.texts_to_sequences(test_review)


        print('Found %s unique tokens.' % len(word_index))
        print(len(sequences))
        data = pad_sequences(sequences, maxlen=MAX_SEQUENCE_LENGTH)

        test_data= pad_sequences(test_sequences, maxlen=MAX_SEQUENCE_LENGTH)
        print("afsas",test_data)
        labels = to_categorical(labels)
        print("Tasdas",labels[0:3])
        print('Shape of data tensor:', data.shape)
        print('Shape of label tensor:', labels.shape)

        num_words = min(MAX_NB_WORDS, len(word_index))
        embedding_matrix = np.zeros((num_words, EMBEDDING_DIM))
        for word, i in word_index.items():
            if i >= MAX_NB_WORDS:
                continue
            embedding_vector = embeddings_index.get(word)
            if embedding_vector is not None:
                # words not found in embedding index will be all-zeros.
                embedding_matrix[i] = embedding_vector

        # load pre-trained word embeddings into an Embedding layer
        # note that we set trainable = False so as to keep the embeddings fixed
        embedding_layer = Embedding(num_words,
                                    EMBEDDING_DIM,
                                    weights=[embedding_matrix],
                                    input_length=MAX_SEQUENCE_LENGTH,
                                    trainable=False)
        print('Training model.')
        sequence_input = Input(shape=(MAX_SEQUENCE_LENGTH,), dtype='int32')
        embedded_sequences = embedding_layer(sequence_input)
        x = Conv1D(128, 5, activation='relu')(embedded_sequences)
        x = MaxPooling1D(5)(x)
        x = Conv1D(128, 5, activation='relu')(x)
        x = MaxPooling1D(5)(x)
        x = Conv1D(128, 5, activation='relu')(x)
        x = MaxPooling1D(35)(x)  # global max pooling
        x = Flatten()(x)
        x = Dense(128, activation='relu')(x)
        preds = Dense(2, activation='softmax')(x)

        model = Model(sequence_input, preds)
        model.compile(loss='categorical_crossentropy',
                      optimizer='rmsprop',
                      metrics=['acc'])

        # happy learning!
        # model.fit(data, labels,
        #           epochs=2, batch_size=128)
        # create the model
        # model = Sequential()
        # model.add(embedding_layer)
        # model.add(LSTM(128))
        # model.add(Dropout(0.5))
        # model.add(Dense(2))
        # model.add(Activation('sigmoid'))
        # model.compile(loss='binary_crossentropy',
        #               optimizer = 'adam',
        #               metrics=["accuracy"])
        # print("Train..")
        #
        # model.fit(data, labels, batch_size=128, nb_epoch=10, verbose=1)
    try :
        # model_json = model.to_json()
        # with open("model_new.json", "w") as json_file:
        #     json_file.write(model_json)
        # # serialize weights to HDF5
        # model.save_weights("model_new.h5")
        # print("Saved model to disk")

        # later...

        # load json and create model
        json_file = open('model_new.json', 'r')
        loaded_model_json = json_file.read()
        json_file.close()
        model = model_from_json(loaded_model_json)
        # load weights into new model
        model.load_weights("model_new.h5")
        model.compile(loss='binary_crossentropy',
                      optimizer = 'adam',
                      metrics=["accuracy"])
    except :
        pass
    if(RUN==False) :
        with open('reviews.pickle','rb') as f:  # Python 3: open(..., 'rb')
            clean_train_reviews = pickle.load(f)

        # sequences = tokenizer.texts_to_sequences(clean_train_reviews)
        # word_index = tokenizer.word_index
        test_review=[]
        text = """Player Role - Zac Clarke / Jon Griffin who deserves number 2 to Sandi. ❓❔
#craigmedalpoll ♨"""
        test_review.append(" ".join(SentenceTokeniser.review_to_wordlist(text, True)))
        print("adfad" ,test_review)
        # tokenizer = Tokenizer(num_words=MAX_NB_WORDS)
        # tokenizer.fit_on_texts(test_review)
        print(clean_train_reviews)
        clean_train_reviews=clean_train_reviews+test_review
        print(clean_train_reviews)
        tokenizer = Tokenizer(num_words=MAX_NB_WORDS)

        tokenizer.fit_on_texts(clean_train_reviews)

        test_sequences = tokenizer.texts_to_sequences(test_review)
        print(test_sequences)
        print("Loaded model from disk")
        test_data= pad_sequences(test_sequences, maxlen=MAX_SEQUENCE_LENGTH)
        print("afsas",test_data)
    classes = model.predict(test_data)
    print(classes)
    # return classes

if __name__ == "__main__":
    main()
