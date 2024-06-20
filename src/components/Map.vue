<template>
    <div id="map">

    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AMapLoader from "@amap/amap-jsapi-loader";

const mapInstance = ref(null);
const props = defineProps({
    // 地图样式，需要实现暗色系，默认值就给成暗色系
    mapStyle: {
        type: String,
        default: "amap://styles/darkblue"
    },
    // 地图配置
    apiConfig: {
        type: Object,
        default: () => ({
            version: '2.0',
            key: 'cbcf346fcd03f7369f4f8ad4f172744e',
            plugins: ["AMap.DistrictSearch"]
        })
    },
    // 区域名
    areaName: { type: String, default: "广州市" },
    // 显示下级行政区级数,行政区级别包括：国家、省/直辖市、市、区/县4个级别
    subdistrict: { type: Number, default: 0 },
    // 是否返回行政区边界坐标点 all / base
    extensions: { type: String, default: "all" },
    // 搜索范围[对应文档https://lbs.amap.com/api/javascript-api/reference/search#m_AMap.DistrictSearch]
    level: { type: String, default: "city" },
    polylineConfig: {
        type: Object,
        default: () => ({
            // 是否显示边界线
            show: true,
            // 是否显示边界以外的区域
            showOuter: false,
            // 边界线条颜色
            strokeColor: "#99ffff",
            // 边界线条粗细
            strokeWeight: 4
        })
    },
    // 地图是否支持双击鼠标放大
    doubleClickZoom: {
        type: Boolean,
        default: true
    },
    // 中心点
    center: {
        type: Array, default: () => [113.264844, 23.114443]
    },
    // 初始地图缩放等级
    zoom: { type: Number, default: 10 },
    // 地图显示的缩放级别范围
    zooms: { type: Array, default: () => [3, 18] },
    // 是否展示卫星地图
    isShowSatellite: {
        type: Boolean,
        default: false
    },
    // 是否展示卫星路网
    isShowRoadNet: {
        type: Boolean,
        default: false
    }
})

// 初始化地图
const initMapInstance = (AMap: any) => {
    // 生成地图的参数，具体可详见高德api文档
    const options: { [key: string]: any } = {
        mapStyle: props.mapStyle,
        doubleClickZoom: props.doubleClickZoom,
        center: props.center,
        zoom: props.zoom,
        zooms: props.zooms,
        // 图层，卫星地图，卫星路网都属于图层，push到这个layers就可以了
        layers: []
    };
    // 展示卫星图层
    if (props.isShowSatellite) {
        options.layers.push(new AMap.TileLayer.Satellite());
    }
    // 展示路网图层
    if (props.isShowRoadNet) {
        options.layers.push(new AMap.TileLayer.RoadNet());
    }
    // 初始化district对象
    const district = new AMap.DistrictSearch({
        level: props.level,
        extensions: props.extensions,
        subdistrict: props.subdistrict,
    });
    // 搜索区域
    district.search(props.areaName, function (status: any, result: any) {
        const bounds = result.districtList[0]["boundaries"];
        // 获取区域各坐标
        const mask = [];
        for (let i = 0; i < bounds.length; i += 1) {
            mask.push([bounds[i]]);
        }
        // 不显示区域外位置
        if (!props.polylineConfig.showOuter) {
            options.mask = mask;
        }


        mapInstance.value = new AMap.Map("map", options);
        // 渲染边界
        renderPolyLine(bounds);
    })
    // 新增一个渲染边界的方法
    const renderPolyLine = (bounds = []) => {
        const { polylineConfig } = props;
        if (polylineConfig.show) {
            for (let i = 0; i < bounds.length; i++) {
                new AMap.Polyline({
                    path: bounds[i],
                    strokeColor: polylineConfig.strokeColor,
                    strokeWeight: polylineConfig.strokeWeight,
                    map: mapInstance.value,
                });
            }
        }

    }
}




const loadAMap = () => {
    window._AMapSecurityConfig = {
        securityJsCode: "9a69e1715cd501eee0df8edfea4f7765"
    }
    AMapLoader.load({
        key: props.apiConfig.key,
        version: props.apiConfig.version,
        plugins: props.apiConfig.plugins,// 你所使用到的插件
    }).then((AMap: any) => {
        initMapInstance(AMap)
    })
}

onMounted(() => {
    loadAMap()
})

</script>
<style scoped lang="less"> #map {
     width: 100vw;
     height: 100vh;
 }

 .amap-container {
     background-image: unset;
 }
</style>