from flask import Flask, jsonify, request
from epanettools.epanettools import EPANetSimulation, Node
from flask_cors import CORS
import os
import tempfile

app = Flask(__name__)
CORS(app)

# Function to get nodes to skip based on elevation threshold
def get_skip_nodes_from_elevation(file_path, elevation_threshold):
    skip_nodes = []
    with open(file_path, 'r') as file:
        lines = file.readlines()
        junctions_section = False
        for line in lines:
            if line.strip() == '[JUNCTIONS]':
                junctions_section = True
                continue
            if junctions_section and line.strip() == '':
                break
            if junctions_section and line.strip() and not line.startswith(';'):
                parts = line.split()
                if len(parts) > 1 and parts[1].replace('.', '', 1).isdigit():
                    if float(parts[1]) > elevation_threshold:
                        skip_nodes.append(parts[0])
    return skip_nodes

# Function to create graph and pressure data from EPANet file
def create_graph_from_epanet(file_path, elevation_threshold=100):
    skip_nodes = get_skip_nodes_from_elevation(file_path, elevation_threshold)

    es = EPANetSimulation(file_path)
    es.run()

    node_neighbors = {}
    pressure_data = {}
    
    for node_index, node in es.network.nodes.items():
        pressure = node.results[Node.value_type['EN_PRESSURE']]
        pressure_data[node.id] = pressure

    for link in es.network.links.values():
        start_node_id = link.start.id
        end_node_id = link.end.id

        if start_node_id in skip_nodes or end_node_id in skip_nodes:
            continue

        node_neighbors.setdefault(start_node_id, []).append((end_node_id, 1.0))
        node_neighbors.setdefault(end_node_id, []).append((start_node_id, 1.0))
        
    return node_neighbors, pressure_data

# Function to find the nearest neighbor for each node
def find_nearest_neighbors(graph):
    nearest = {}
    for node_id, edges in graph.items():
        if edges:
            closest = min(edges, key=lambda x: x[1])[0]
            nearest[node_id] = closest
    return nearest

# Function to identify initial sensor nodes
def identify_initial_sensor_nodes(nearest):
    counts = {}
    for n in nearest.values():
        counts[n] = counts.get(n, 0) + 1

    sensors = set()
    for node, count in counts.items():
        if count > 1:
            sensors.add(node)
    return sensors

# Function to identify left-out nodes
def identify_left_out_nodes(nearest, sensors):
    left_out_nodes = set()
    for node, neighbor in nearest.items():
        if neighbor not in sensors:
            left_out_nodes.add(node)
    return left_out_nodes

# Function to remove redundant sensor nodes
def remove_redundant_sensors(graph, sensors):
    redundant = set()
    for s in sensors:
        is_redundant = True
        for neighbor, _ in graph[s]:
            if neighbor not in sensors:
                is_redundant = False
                break
        if is_redundant:
            redundant.add(s)
    
    sensors.difference_update(redundant)
    return sensors

# Function to map non-sensor nodes to sensor nodes
def map_to_sensors(nearest, sensors):
    mapping = {}
    for node, neighbor in nearest.items():
        if node not in sensors:
            mapping[node] = nearest[node]
    return mapping

def identify_sensor_nodes(file_path):
    node_neighbors, _ = create_graph_from_epanet(file_path)

    nearest_neighbors = find_nearest_neighbors(node_neighbors)
    initial_sensors = identify_initial_sensor_nodes(nearest_neighbors)
    left_out_nodes = identify_left_out_nodes(nearest_neighbors, initial_sensors)
    sensors = initial_sensors.union(left_out_nodes)
    sensors = remove_redundant_sensors(node_neighbors, sensors)
    return sensors

def main(file_path):
    sensors = identify_sensor_nodes(file_path)
    node_neighbors, _ = create_graph_from_epanet(file_path)

    nearest_neighbors = find_nearest_neighbors(node_neighbors)
    sensors = remove_redundant_sensors(node_neighbors, sensors)
    mapping = map_to_sensors(nearest_neighbors, sensors)

    print("Sensor Nodes:")
    print(' '.join(map(str, sensors)))

    print("Mapping of Non-Sensor Nodes to Sensor Nodes:")
    for node, sensor in mapping.items():
        print(f"Node {node} is covered by Sensor Node {sensor}")

@app.route('/sensor-allocation', methods=['POST'])
def sensor_allocation():
    # Check if the request contains the file
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    # Check if a file was actually uploaded
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the uploaded file to a temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False)
    file.save(temp_file.name)
    temp_file.close()  # Close the file before attempting to delete it

    try:
        sensors = identify_sensor_nodes(temp_file.name)
        node_neighbors, _ = create_graph_from_epanet(temp_file.name)

        nearest_neighbors = find_nearest_neighbors(node_neighbors)
        sensors = remove_redundant_sensors(node_neighbors, sensors)
        mapping = map_to_sensors(nearest_neighbors, sensors)

        return jsonify({
            'sensor_nodes': list(sensors),
            'mapping': mapping
        })
    finally:
        os.unlink(temp_file.name)  # Delete the temporary file

if __name__ == '__main__':
    app.run(debug=True, port=8080)