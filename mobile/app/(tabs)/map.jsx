import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { COLORS } from '../../constants/colors';
import { useTranslation } from '../../context/LanguageContext';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const webViewRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { t } = useTranslation();

  // Sample data for demonstration
  const sampleHeatmapData = [
    { lat: 28.6139, lng: 77.2090, intensity: 0.8 }, // Delhi - High disease activity
    { lat: 28.6200, lng: 77.2100, intensity: 0.6 }, // Delhi area 2
    { lat: 28.6300, lng: 77.2200, intensity: 0.9 }, // Delhi area 3 - Very high
    { lat: 28.6000, lng: 77.1900, intensity: 0.4 }, // Delhi area 4 - Moderate
    { lat: 28.6400, lng: 77.2300, intensity: 0.7 }, // Delhi area 5
  ];

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Health Officials Map</title>
        
        <!-- Leaflet CSS -->
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        
        <!-- Leaflet Heatmap Plugin -->
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.min.js"></script>
        
        <style>
            body { 
                margin: 0; 
                padding: 0; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            }
            #map { 
                height: 100vh; 
                width: 100%; 
            }
            .legend {
                background: white;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                font-size: 12px;
            }
            .legend-title {
                font-weight: bold;
                margin-bottom: 5px;
                color: #333;
            }
            .legend-item {
                display: flex;
                align-items: center;
                margin: 3px 0;
            }
            .legend-color {
                width: 15px;
                height: 15px;
                margin-right: 8px;
                border-radius: 3px;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        
        <script>
            // Initialize map centered on India
            const map = L.map('map').setView([28.6139, 77.2090], 11);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map);
            
            // Sample heatmap data (disease reports)
            const heatmapData = ${JSON.stringify(sampleHeatmapData.map(point => [point.lat, point.lng, point.intensity]))};
            
            // Create heatmap layer
            const heatmapLayer = L.heatLayer(heatmapData, {
                radius: 30,
                blur: 25,
                maxZoom: 17,
                gradient: {
                    0.2: 'blue',
                    0.4: 'cyan',
                    0.6: 'lime',
                    0.8: 'yellow',
                    1.0: 'red'
                }
            }).addTo(map);
            
            // Add some sample markers for ASHA workers
            const ashaWorkers = [
                { lat: 28.6139, lng: 77.2090, name: "Priya Sharma", reports: 15 },
                { lat: 28.6200, lng: 77.2100, name: "Sunita Devi", reports: 12 },
                { lat: 28.6300, lng: 77.2200, name: "Meera Singh", reports: 20 },
            ];
            
            // Add ASHA worker markers
            ashaWorkers.forEach(worker => {
                L.marker([worker.lat, worker.lng])
                    .addTo(map)
                    .bindPopup(\`
                        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                            <strong>\${worker.name}</strong><br>
                            ASHA Worker<br>
                            <small>Reports submitted: \${worker.reports}</small>
                        </div>
                    \`);
            });
            
            // Add legend
            const legend = L.control({ position: 'bottomright' });
            legend.onAdd = function(map) {
                const div = L.DomUtil.create('div', 'legend');
                div.innerHTML = \`
                    <div class="legend-title">${t('map.legend.diseaseActivity')}</div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: red;"></div>
                        <span>${t('map.legend.veryHigh')}</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: yellow;"></div>
                        <span>${t('map.legend.high')}</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: lime;"></div>
                        <span>${t('map.legend.moderate')}</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: cyan;"></div>
                        <span>${t('map.legend.low')}</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: blue;"></div>
                        <span>${t('map.legend.veryLow')}</span>
                    </div>
                \`;
                return div;
            };
            legend.addTo(map);
            
            // Notify React Native that map is ready
            window.ReactNativeWebView?.postMessage(JSON.stringify({
                type: 'MAP_LOADED',
                data: { status: 'success' }
            }));
        </script>
    </body>
    </html>
  `;

  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'MAP_LOADED') {
        setMapLoaded(true);
        console.log('Map loaded successfully');
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('map.title')}</Text>
        <Text style={styles.subtitle}>
          {t('map.subtitle')}
        </Text>
      </View>
      
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: leafletHTML }}
          style={styles.webview}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
        
        {!mapLoaded && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>{t('map.loading')}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default MapScreen;