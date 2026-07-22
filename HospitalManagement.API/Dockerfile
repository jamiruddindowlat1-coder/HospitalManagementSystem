# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["HospitalManagement.API.csproj", "./"]
RUN dotnet restore "HospitalManagement.API.csproj"
COPY . .
RUN dotnet build "HospitalManagement.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "HospitalManagement.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final production stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5151
EXPOSE 5151
ENTRYPOINT ["dotnet", "HospitalManagement.API.dll"]
