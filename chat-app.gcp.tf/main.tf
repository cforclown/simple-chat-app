provider "google" {
  project = "chat-app"
  region  = "asia-southeast2"
}

resource "google_compute_network" "dev_network" {
  name                    = "dev_network"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "dev_subnet" {
  name          = "dev_subnet"
  ip_cidr_range = "10.100.0.0/16"
  network       = google_compute_network.dev_network.id
  region        = "asia-southeast2"
}


