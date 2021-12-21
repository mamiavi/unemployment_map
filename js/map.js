//Projection
proj4.defs('EPSG:1000','+proj=laea +lat_0=40 +lon_0=-5 +x_0=0 +y_0=0 +ellps=GRS80'+
'+towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

ol.proj.proj4.register(proj4);

//Styles
const noSpainStyle = new ol.style.Style({
    fill: new ol.style.Fill({color:[220, 220, 220, 255]}),
    stroke: new ol.style.Stroke({
    color: 'black'})
});
  
const SpainStyle = new ol.style.Style({
    fill: new ol.style.Fill({color:'white'}),
    stroke: new ol.style.Stroke({
        color: 'black'})
});

//Layers: SImplified to 1000 meters and deleted the decimals. Canarias simplified 0.01 degrees
const spain = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'CARTOGRAPHY/spainSimplified.geojson',
        format: new ol.format.GeoJSON({dataProjection: ol.proj.get('EPSG:1000')})
    }),
    style: SpainStyle,
    name:'spain'
});

const africa = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'CARTOGRAPHY/africaSimplified.geojson',
        format: new ol.format.GeoJSON({dataProjection: ol.proj.get('EPSG:1000')})
    }),
    style: noSpainStyle,
    name:'africa'
});

const andorra = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'CARTOGRAPHY/andorra1000.geojson',
        format: new ol.format.GeoJSON({dataProjection: ol.proj.get('EPSG:1000')})
    }),
    style:noSpainStyle,
    name:'andorra'
});

const canarias = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'CARTOGRAPHY/canariasSimplified.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style:SpainStyle,
    name:'canarias'
});

const europe = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'CARTOGRAPHY/europeSimplified.geojson',
        format: new ol.format.GeoJSON({dataProjection: ol.proj.get('EPSG:1000')})
    }),
    style:noSpainStyle,
    name:'europe'
});

const positions = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'CARTOGRAPHY/positions1000.geojson',
        format: new ol.format.GeoJSON({dataProjection: ol.proj.get('EPSG:1000')})
    }),
    name: 'positions'
});

const positionsCanary = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'CARTOGRAPHY/positions4326.geojson',
        format: new ol.format.GeoJSON({dataProjection: ol.proj.get('EPSG:4326')})
    })
})


var listenerKey = spain.getSource().on('change', function(e){

    if(spain.getSource().getState() == 'ready'){

        extent = (spain.getSource().getExtent());

        center = ol.extent.getCenter(extent);

        map.getView().setCenter([center[0]-90000, center[1]-10000]);
        
    }else{
        console.log('Spain source is loading');
    }
});

var listenerKey = canarias.getSource().on('change', function(e){

    if(canarias.getSource().getState() == 'ready'){

        extent = (canarias.getSource().getExtent());

        center = ol.extent.getCenter(extent);

        canarymap.getView().setCenter(center);

    }else{
        console.log('Canary source is loading')
    }
});


function mapMain(){

    map = new ol.Map({
        layers: [andorra, europe, africa, spain, positions],
        view: new ol.View({
        center: [0,0],
        zoom: 6.5,
        projection: ol.proj.get('EPSG:1000')
        }),
        controls:[new ol.control.ScaleLine({target: document.getElementById("scaleline")})],
        interactions:[],
        target: 'map'
    });

    canarymap = new ol.Map({
        layers: [canarias, positionsCanary],
        view: new ol.View({
        center: [0,0],
        zoom: 6.1
        }),
        target: 'canarymap',
        controls:[],
        interactions:[]
    });

    //Configure the selection

    let select = null;
    let selectcanary = null;

    const selectClick = new ol.interaction.Select({
        condition: ol.events.condition.click
    });

    const selectClickCanary = new ol.interaction.Select({
        condition: ol.events.condition.click
    });

    select = selectClick;
    selectcanary = selectClickCanary;

    if (select !== null) {
        map.addInteraction(select);
        select.on('select', function (e) {
            console.log("Has seleccionado algo");
        });
    }

    if (selectcanary !== null) {
        canarymap.addInteraction(selectcanary);
        selectcanary.on('select', function (e) {
            console.log("Has seleccionado algo");
        });
    }

}