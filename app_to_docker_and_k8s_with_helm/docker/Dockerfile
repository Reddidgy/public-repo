# build step1
FROM golang AS build
WORKDIR /app
COPY src/main.go .
RUN CGO_ENABLED=0 GOOS=linux go build -o api main.go

# create final build
FROM scratch
WORKDIR /root/
COPY --from=build /app/api .
CMD ["./api"]