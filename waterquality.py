import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# Load and preprocess data
def preprocess_data(data):
    data.fillna(data.mean(), inplace=True)
    data.drop_duplicates(inplace=True)
    return data

# Prepare features and targets
def prepare_features_target(data):
    X = data.drop('Potability', axis=1)
    y = data['Potability']
    return X, y

# Flask app
app = Flask(__name__)
CORS(app)

# Create the uploads directory if it doesn't exist
uploads_dir = 'uploads'
os.makedirs(uploads_dir, exist_ok=True)

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    if file:
        filename = file.filename
        file_path = os.path.join(uploads_dir, filename)
        file.save(file_path)

        data = pd.read_csv(file_path)
        data = preprocess_data(data)
        X, y = prepare_features_target(data)
        
        # Splitting and scaling the data
        X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, shuffle=True, random_state=404)
        scaler = StandardScaler()
        scaler.fit(X_train)
        scaled_input = scaler.transform(X)

        # Building and training the model
        input_shape = (X_train.shape[1],)
        model = create_advanced_dl_model(input_shape)
        model.fit(scaler.transform(X_train), y_train, epochs=150, batch_size=64, verbose=1)
        
        prediction = model.predict(scaled_input)
        os.remove(file_path)  # Remove the file after processing
        return jsonify({'potability_prediction': prediction.flatten().tolist()})
    return jsonify({'error': 'No file provided'})

def create_advanced_dl_model(input_shape):
    model = Sequential([
        Dense(256, activation='relu', input_shape=input_shape),
        Dropout(0.3),
        Dense(128, activation='relu'),
        Dropout(0.3),
        Dense(64, activation='relu'),
        Dense(1, activation='sigmoid')
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

if __name__ == '__main__':
    app.run(port=5200, debug=True)
