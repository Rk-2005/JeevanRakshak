#graphHandler.py
from epanettools.epanettools import EPANetSimulation, Node, Link

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
                # Ensure that there are enough parts and the second part is a number
                if len(parts) > 1 and parts[1].replace('.', '', 1).isdigit():
                    if float(parts[1]) > elevation_threshold:
                        skip_nodes.append(parts[0])
    return skip_nodes


def create_graph_from_epanet(file_path):
    elevation_threshold = 100  # Set your elevation threshold here
    skip_nodes = get_skip_nodes_from_elevation(file_path, elevation_threshold)

    es = EPANetSimulation(file_path)
    es.run()

    node_neighbors = {}  # Dictionary for nodes and their neighbors
    pressure_data = {}   # Dictionary for time-series pressure data
    
    for node_index, node in es.network.nodes.items():
        pressure = node.results[Node.value_type['EN_PRESSURE']]  # Correct way to access pressure
        pressure_data[node.id] = pressure

    for link in es.network.links.values():
        start_node_id = link.start.id  # Use node.id instead of node.node_id
        end_node_id = link.end.id      # Use node.id instead of node.node_id

        if start_node_id in skip_nodes or end_node_id in skip_nodes:
            continue

        node_neighbors.setdefault(start_node_id, []).append((end_node_id, 1.0))
        node_neighbors.setdefault(end_node_id, []).append((start_node_id, 1.0))

    return node_neighbors, pressure_data

def print_graph(node_neighbors):
    for node_id, neighbors in node_neighbors.items():
        neighbor_strings = [f"Node {n[0]} (Weight: {n[1]})" for n in neighbors]
        print(f"Node {node_id} Neighbors: {', '.join(neighbor_strings)}")

def print_pressure_data(pressure_data):
    for node_id, pressure in pressure_data.items():
        print(f"Node {node_id}: Pressure: {pressure[:5]}...")

def main(file_path):
    node_neighbors, pressure_data = create_graph_from_epanet(file_path)
    print("Graph:")
    print_graph(node_neighbors)
    print("\nNode Pressures:")
    print_pressure_data(pressure_data)

if __name__ == "__main__":
    file_path = "Network.inp"  # Replace with your EPANet file path
    main(file_path)
