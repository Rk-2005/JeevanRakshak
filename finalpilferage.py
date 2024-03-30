from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/pilferage', methods=['POST'])
def check_pilferage():
    try:
        # Get the CSV file from the request
        csv_file = request.files['file']
        
        # Read CSV into a DataFrame
        data = pd.read_csv(csv_file)
        
        # Calculate percentiles
        warning_threshold = data['Flow'].quantile(0.85)
        high_risk_threshold = data['Flow'].quantile(0.90)
        pilferage_threshold = data['Flow'].quantile(0.95)
        
        # Initialize lists to store sensor numbers for different categories
        warning = []
        high_risk = []
        pilferage = []
        
        # Check flow rates and categorize sensor numbers
        for index, row in data.iterrows():
            if warning_threshold <= row['Flow'] < high_risk_threshold:
                warning.append(row['Sensor_Node'])
            elif high_risk_threshold <= row['Flow'] < pilferage_threshold:
                high_risk.append(row['Sensor_Node'])
            elif row['Flow'] >= pilferage_threshold:
                pilferage.append(row['Sensor_Node'])

        # Prepare response
        response = {
            'warning': warning,
            'high_risk': high_risk,
            'pilferage': pilferage
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
