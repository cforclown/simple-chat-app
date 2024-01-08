provider "google" {
  project = "simple-chat-app"
  region  = "asia-southeast2"
}

resource "google_compute_network" "development_network" {
  name                    = "development-network"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "dev_subnet_01" {
  name          = "dev-subnet-01"
  ip_cidr_range = "10.100.0.0/16"
  network       = google_compute_network.development_network.id
  region        = "asia-southeast2"
}
