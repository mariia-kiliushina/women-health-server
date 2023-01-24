#!/bin/bash

psql -U postgres -c "DROP DATABASE IF EXISTS women_health_db WITH (FORCE);";
psql -U postgres -c "CREATE DATABASE women_health_db WITH TEMPLATE women_health_dev_template ENCODING 'UTF-8';";
