from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Load the data
df_pressure = pd.read_csv('pressure_response_random.csv', header=None)
df_leak = pd.read_csv('leak_values_random.csv', header=None)

# Use only the first column (pressure) for training
X = df_pressure.iloc[:, 0].values.reshape(-1, 1)
y = df_leak.values.argmax(axis=1)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Normalize the data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Define the model
model = Sequential([
    Dense(64, activation='relu', input_shape=(1,)),
    Dense(64, activation='relu'),
    Dense(df_leak.shape[1], activation='softmax')
])

# Compile the model
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train_scaled, y_train, epochs=50, batch_size=32, validation_split=0.2)

# Flask API
app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    try:
        df = pd.read_csv(file)
        if 'Pressure' not in df.columns:
            return jsonify({'error': 'CSV file must contain a Pressure column'}), 400

        pressure_values = df['Pressure'].values.reshape(-1, 1)
        pressure_values_scaled = scaler.transform(pressure_values)

        predictions = model.predict(pressure_values_scaled)
        leak_probabilities = predictions[:, 1]  # Assuming class 1 represents a leak

        results = [
            {'sensor_node': f'Node{i+1}', 'leak_probability': float(prob), 'leak_detected': bool(prob > 0.0001)}
            for i, prob in enumerate(leak_probabilities)
        ]

        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
