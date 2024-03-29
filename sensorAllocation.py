from graphHandler import create_graph_from_epanet

# Define the function to find the nearest neighbor for each node
def find_nearest_neighbors(graph):
    nearest = {}
    for node_id, edges in graph.items():
        if edges:
            closest = min(edges, key=lambda x: x[1])[0]  # Find the closest neighbor by weight
            nearest[node_id] = closest
    return nearest

# Define the function to identify initial sensor nodes
def identify_initial_sensor_nodes(nearest):
    counts = {}
    for n in nearest.values():
        counts[n] = counts.get(n, 0) + 1

    sensors = set()
    for node, count in counts.items():
        if count > 1:
            sensors.add(node)
    return sensors

# Define the function to identify left-out nodes
def identify_left_out_nodes(nearest, sensors):
    left_out_nodes = set()
    for node, neighbor in nearest.items():
        if neighbor not in sensors:
            left_out_nodes.add(node)
    return left_out_nodes

# Define the function to remove redundant sensor nodes
def remove_redundant_sensors(graph, sensors):
    redundant = set()
    for s in sensors:
        is_redundant = True
        # Use node IDs directly without assuming 1-indexing
        for neighbor, _ in graph[s]:
            if neighbor not in sensors:
                is_redundant = False
                break
        if is_redundant:
            redundant.add(s)
    
    sensors.difference_update(redundant)
    return sensors

# Define the function to map non-sensor nodes to sensor nodes
def map_to_sensors(nearest, sensors):
    mapping = {}
    for node, neighbor in nearest.items():
        if node not in sensors:  # it's a non-sensor node
            mapping[node] = nearest[node]  # map it to its nearest sensor
    return mapping

def identify_sensor_nodes(file_path):
    # Create graph and pressure data from EPANet data
    node_neighbors, pressure_data = create_graph_from_epanet(file_path)

    # Apply the sensor allocation algorithm using node_neighbors
    nearest_neighbors = find_nearest_neighbors(node_neighbors)
    initial_sensors = identify_initial_sensor_nodes(nearest_neighbors)
    left_out_nodes = identify_left_out_nodes(nearest_neighbors, initial_sensors)
    sensors = initial_sensors.union(left_out_nodes)
    sensors = remove_redundant_sensors(node_neighbors, sensors)
    return sensors

def main(file_path):
    # Create graph and pressure data from EPANet data
    node_neighbors, pressure_data = create_graph_from_epanet(file_path)

    # Apply the sensor allocation algorithm using node_neighbors
    nearest_neighbors = find_nearest_neighbors(node_neighbors)
    initial_sensors = identify_initial_sensor_nodes(nearest_neighbors)
    left_out_nodes = identify_left_out_nodes(nearest_neighbors, initial_sensors)
    sensors = initial_sensors.union(left_out_nodes)
    sensors = remove_redundant_sensors(node_neighbors, sensors)
    mapping = map_to_sensors(nearest_neighbors, sensors)

    # Output results
    print("Sensor Nodes:")
    print(' '.join(map(str, sensors)))

    print("Mapping of Non-Sensor Nodes to Sensor Nodes:")
    for node, sensor in mapping.items():
        print(f"Node {node} is covered by Sensor Node {sensor}")
    
    
if __name__ == "__main__":
    file_path = "Network.inp"
    main(file_path)


