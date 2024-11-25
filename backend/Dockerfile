# STAGE 1: BUILD
# Use the official Rust image as a build stage
FROM rust:1.79 AS builder

# bind to 0.0.0.0 instead of localhost
ENV ROCKET_ADDRESS=0.0.0.0
ENV ROCKET_PORT=8000

# Create a new empty shell project
RUN USER=root cargo new --bin backend
WORKDIR /backend

# Copy our manifests
COPY ./Cargo.toml ./Cargo.toml
COPY ./Cargo.lock ./Cargo.lock
COPY ./Rocket.toml ./Rocket.toml


# This build step will cache dependencies
RUN cargo build --release
RUN rm src/*.rs

# Copy source tree
COPY /src ./src

# Build for release
RUN rm ./target/release/deps/backend*
RUN cargo build --release


# STAGE 2: EXECUTE
# Use the official Debian image as a base
FROM debian:bookworm-slim

ENV ROCKET_ADDRESS=0.0.0.0
ENV ROCKET_PORT=8000

# Copy the build artefact from the build stage
COPY --from=builder /backend/target/release/backend .
COPY --from=builder /backend/Rocket.toml .

# Expose the port the server will run on
EXPOSE 8000

# Run the web service on container startup
CMD ["./backend"]