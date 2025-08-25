import MapView, { Polyline, Marker } from 'react-native-maps';

export function TripMap({children, center, width='100%', height='100%', data}) {
  let filtered_data;
  // console.log('data:', data)
  if(data.length==0)
    filtered_data = [{latitude: 24.78635, longitude: 121.00082}];
  else {
    filtered_data = data.filter((value) => {
      const longitude = value.longitude; //經度
      const latitude = value.latitude; //緯度
      if(Math.abs(longitude) > 180 || Math.abs(latitude) > 90) {
        console.log('經緯度超出範圍');
        return false;
      }
      return true;
    })
  }
  // console.log('center:', center)
  
  return (
    <MapView style={{ width: width, height: height, }}
      initialRegion={{
        latitude: filtered_data[0].latitude, //37.579699136444226
        longitude: filtered_data[0].longitude, //126.97706818842235
        latitudeDelta: 0.02,
        longitudeDelta: 0.01,
      }}
      // provider={PROVIDER_GOOGLE}
      customMapStyle={mapStyle}
      ref={ref => this.mapView = ref}
    >
      {children}
    </MapView>
  )
}

export function TripRoute({route_data, strokeColor='#ed4242aa', strokeWidth=6}) {
  // console.log('route_data:', route_data);
  // console.log('draw route.')
  if(!route_data) return null;
  // console.log('route_data:', route_data)
  const coordinates = route_data.filter((value) => {
    const longitude = value.longitude; //經度
    const latitude = value.latitude; //緯度
    if(Math.abs(longitude) > 180 || Math.abs(latitude) > 90) {
      // console.log('經緯度超出範圍');
      return false;
    }
    return true;
  }).map((value, i) => {
    // console.log('緯度:', value.account_details.latitude,'經度:',  value.account_details.longitude)
    return {latitude: value.latitude, longitude: value.longitude};
  });
  // console.log(coordinates);
  return (
    <Polyline
      // coordinates={[
      //   { latitude: 37.5777886429642, longitude: 126.97159503498985 },
      //   { latitude: 37.579699136444226, longitude: 126.97706818842235 },
      //   { latitude: 37.580128907480926, longitude: 126.98064056279014 },
      // ]}
      coordinates={coordinates}
      strokeColor={strokeColor}
      strokeWidth={strokeWidth}
    />
  )
}
export function TripMarkers({markers_data}) {
  // console.log('markers: ', markers_data);
  return (
    markers_data.map((marker, index) => (
      <Marker
        key={index}
        coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
        title={marker.product_name}
        description={marker.address}
      />
    ))
  )
}
const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ]