import pandas as pd
import numpy as np
from sklearn import preprocessing
from sklearn.linear_model import LogisticRegression
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.mixture import GaussianMixture
from sklearn.ensemble import ExtraTreesClassifier

TRAINING_DATA = '../analytics/HR_comma_sep.csv'


def calculate_turnover_risk(employee):
    employee = np.array([
        employee['satisfaction'],
        employee['sentiment'],
        employee['last_evaluation'],
        employee['number_project'],
        employee['avg_monthly_hours'],
        employee['years_at_company'],
        employee['work_accident'],
        employee['promotion_last_5years'],
        employee['department'],
        employee['salary']
    ])

    res = classifier.predict(employee)
    prob = classifier.predict_proba(employee)

    # if leaving then return probability
    if res[0] == 1:
        print('sentiment: ', employee[1])
        return prob[0][1]
    else:
        return 0


def train_classifier():
    data = pd.read_csv(TRAINING_DATA)

    data['salaries'] = 1
    data['salaries'][data['salary'] == 'medium'] = 2
    data['salaries'][data['salary'] == 'high'] = 3

    data = data.rename(columns={'sales': 'department'})

    data['dep'] = 1
    data['dep'][data['department'] == 'accounting'] = 2
    data['dep'][data['department'] == 'hr'] = 3
    data['dep'][data['department'] == 'technical'] = 4
    data['dep'][data['department'] == 'support'] = 5
    data['dep'][data['department'] == 'management'] = 6
    data['dep'][data['department'] == 'IT'] = 7
    data['dep'][data['department'] == 'product_mng'] = 8
    data['dep'][data['department'] == 'RandD'] = 9

    del data['department']
    del data['salary']

    # 'add' sentiment data
    sentiment_variance = np.random.uniform(-0.5, 0.5, 14999)
    data.insert(1, 'sentiment', data['satisfaction_level'])
    data['sentiment'] += sentiment_variance

    x = data
    scaler = preprocessing.scale(x)
    cols = x.columns
    data1 = pd.DataFrame(scaler, columns=cols, index=data.index)
    data1['left'] = data['left']
    data.head()

    X = data
    Y = X['left']
    del X['left']

    # pca = PCA(n_components=8)
    # X = pca.fit_transform(X)

    # train test split
    # X_train, X_test, y_train, y_test = train_test_split(X, Y,
    #                                                     test_size=0.33,
    #                                                     random_state=42)

    # Logistic Regression
    # logis = LogisticRegression()
    # logis.fit(X_train, y_train)
    # logis_res = logis.predict(X_test)
    # accuracy = accuracy_score(y_test, logis_res)
    # print(accuracy)
    # print(cross_val_score(logis, X_test, y_test))

    # Random Forest
    forest = RandomForestClassifier(n_estimators=100, random_state=42)
    forest.fit(X, Y)
    # forest = my_forest.predict(X_test)
    # accuracy = accuracy_score(y_test, forest)
    # print(accuracy)
    # print(cross_val_score(my_forest, X_test, y_test))

    # Gradient Boosting Classifier
    # gradboost = GradientBoostingClassifier(n_estimators=100, random_state=42)
    #    .fit(X_train, y_train)
    # prediction = gradboost.predict(X_test)
    # accuracy = accuracy_score(y_test, prediction)
    # print(accuracy)
    # print(cross_val_score(gradboost, X_test, y_test))

    # Extremely Randomized Trees
    # extratrees = ExtraTreesClassifier(n_estimators=100, random_state=42)
    #     .fit(X_train, y_train)
    # prediction = extratrees.predict(X_test)
    # accuracy = accuracy_score(y_test, prediction)
    # print(accuracy)
    # print(cross_val_score(extratrees, X_test, y_test))

    # Gaussian Mixture
    # gm = GaussianMixture(random_state=42).fit(X_train, y_train)
    # prediction = gm.predict(X_test)
    # accuracy = accuracy_score(y_test, prediction)
    # print(accuracy)
    # print(cross_val_score(gm, X_test, y_test))
    return forest


classifier = train_classifier()
