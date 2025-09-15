from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import tempfile
import json

app = Flask(__name__)
CORS(app)

# Mock function to simulate sensor allocation without EPANet
def mock_sensor_allocation(file_path, elevation_threshold=100):
    """
    Mock sensor allocation function that simulates the EPANet functionality
    This is a simplified version that works without the epanettools dependency
    """
    try:
        # Read the INP file to extract basic network information
        nodes = []
        links = []
        
        with open(file_path, 'r') as file:
            lines = file.readlines()
            junctions_section = False
            pipes_section = False
            
            for line in lines:
                line = line.strip()
                
                if line == '[JUNCTIONS]':
                    junctions_section = True
                    pipes_section = False
                    continue
                elif line == '[PIPES]':
                    pipes_section = True
                    junctions_section = False
                    continue
                elif line.startswith('[') and line.endswith(']'):
                    junctions_section = False
                    pipes_section = False
                    continue
                
                if junctions_section and line and not line.startswith(';'):
                    parts = line.split()
                    if len(parts) >= 2:
                        node_id = parts[0]
                        elevation = float(parts[1]) if parts[1].replace('.', '', 1).isdigit() else 0
                        if elevation <= elevation_threshold:
                            nodes.append({
                                'id': node_id,
                                'elevation': elevation,
                                'pressure': 50 + (elevation * 0.1)  # Mock pressure calculation
                            })
                
                if pipes_section and line and not line.startswith(';'):
                    parts = line.split()
                    if len(parts) >= 3:
                        pipe_id = parts[0]
                        start_node = parts[1]
                        end_node = parts[2]
                        links.append({
                            'id': pipe_id,
                            'start': start_node,
                            'end': end_node
                        })
        
        # Mock sensor allocation algorithm
        # In a real implementation, this would use complex optimization algorithms
        sensor_candidates = []
        
        # Prioritize nodes with higher pressure (more critical for monitoring)
        sorted_nodes = sorted(nodes, key=lambda x: x['pressure'], reverse=True)
        
        # Select top nodes as sensor candidates
        num_sensors = min(10, len(sorted_nodes))  # Limit to 10 sensors max
        for i in range(num_sensors):
            node = sorted_nodes[i]
            sensor_candidates.append({
                'node_id': node['id'],
                'elevation': node['elevation'],
                'pressure': node['pressure'],
                'priority': i + 1,
                'coverage_score': node['pressure'] / 100.0  # Mock coverage score
            })
        
        return {
            'sensors': sensor_candidates,
            'total_nodes': len(nodes),
            'total_links': len(links),
            'network_info': {
                'nodes': nodes[:5],  # Return first 5 nodes as sample
                'links': links[:5]   # Return first 5 links as sample
            }
        }
        
    except Exception as e:
        return {'error': f'Error processing file: {str(e)}'}

@app.route('/sensor-allocation', methods=['POST'])
def sensor_allocation():
    try:
        # Get the INP file from the request
        inp_file = request.files['file']
        elevation_threshold = request.form.get('elevation_threshold', 100, type=float)
        
        if not inp_file:
            return jsonify({'error': 'No file provided'}), 400
        
        # Save the uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.inp') as tmp_file:
            inp_file.save(tmp_file.name)
            tmp_file_path = tmp_file.name
        
        try:
            # Process the file
            result = mock_sensor_allocation(tmp_file_path, elevation_threshold)
            
            if 'error' in result:
                return jsonify(result), 400
            
            return jsonify(result), 200
            
        finally:
            # Clean up the temporary file
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'sensor-allocation'}), 200

if __name__ == '__main__':
    print("Starting Sensor Allocation Service (Mock Version)")
    print("Note: This is a simplified version that doesn't require EPANet tools")
    print("For full functionality, install epanettools with proper compilation setup")
    app.run(debug=True, port=5001)

