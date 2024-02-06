// function showARScene() {
//     var arScene = document.getElementById('background')
//     var video = document.querySelector('video')
//     var container = document.getElementById('container')

//     if (container && video) {
//       video.style.display = 'block' ;
//       container.style.display = 'block'
//     }

//     if(arScene) {
//         arScene.remove()
//     }
//   }


// Vị trí, tọa đô

 // Tọa độ địa điểm chơi, config theo gg maps
const organizationLocation = {
    latitude: 21.0436096,
    longitude: 105.8668544
}


// khởi tạo tọa độ người chơi 
let currentLocation = {
    latitude: organizationLocation.latitude,
    longitude: organizationLocation.longitude
}
  
  // hàm set Location của người chơi
function setCurrentLocation(latitude, longitude) {
    currentLocation.latitude = latitude;
    currentLocation.longitude = longitude
}

// Hàm tính toán khoảng cách từ vị trí tổ chức đến tọa độ người chơi đơn vị đo là meters
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const deg2rad = (deg) => deg * (Math.PI / 180);

    const R = 6371000; 

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance; 
}

// const point1 = { latitude: 21.0061715, longitude: 105.8347748 };
// const point2 = { latitude: 21.0061849, longitude: 105.8347881 };

// const distance = calculateHaversineDistance(point1.latitude, point1.longitude, point2.latitude, point2.longitude);

  
// Đặt tọa độ người chơi theo GPS của máy
  
AFRAME.registerComponent('locationfinder', {
    init: function() {
        navigator.geolocation.getCurrentPosition(function(location) {
            console.log(location)
            const distance = calculateHaversineDistance(location.coords.latitude, location.coords.longitude, organizationLocation.latitude, organizationLocation.longitude)
            if (distance > 50) {
                // setCurrentLocation(location.coords.latitude, location.coords.longitude)

                // alert('Vui lòng đến vị trí trung tâm để tham gia sự kiện')
                // window.location.href = 'https://www.google.com';
                // setCurrentLocation(location.coords.latitude, location.coords.longitude)
            } else {
                setCurrentLocation(location.coords.latitude, location.coords.longitude)
            }
        })
    }
})
  
//   AFRAME.registerComponent('foo', {
//     events: {
//       click: function (evt) {
//         console.log('This entity was clicked!');
//       }
//     }
//   });
  

// Vật phẩm

    // Sản phẩm
const products = [
    { name: 'Nồi', quantity: 2, image: '#noi', imageUrl: './public/assets/img/noi.jpg' },
    { name: 'Nước rửa bát', quantity: 3, image: '#nuoc-rua-chen', imageUrl: './public/assets/img/nuoc-rua-chen.png' },
    { name: 'Nước lau Kính', quantity: 4, image: '#nuoc-lau-kinh', imageUrl: './public/assets/img/nuoc-lau-kinh-01.png' },
    { name: 'Tẩy Xoong Nồi', quantity: 1, image: '#tay-xoong-noi', imageUrl: './public/assets/img/tay-xoong-noi.png' }
  ];


  // Hàm Random vật phẩm
function getRandomProduct() {
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
}


    // Khởi tạo vật phẩm random
let selectedProduct = getRandomProduct();

let timeoutId; // Biến để lưu trữ ID của setTimeout

// render ra vật phẩm nếu còn
function performProductActions() {
    var sceneEl = document.querySelector('a-scene');

    const entityElement = document.createElement('a-entity');
    entityElement.setAttribute('id', "myEntity")
    entityElement.setAttribute('cursor', "rayOrigin: mouse")
    entityElement.setAttribute('look-at', "[gps-new-camera]")
    entityElement.setAttribute('scale', "0.6 0.6 0.6")
    entityElement.setAttribute('animation__rotation', "property: rotation; to: 0 360 0; loop: true; dur: 5000")
    entityElement.setAttribute('markerhandler', "")
    const randomCoordinates = getRandomCoordinate()
    entityElement.setAttribute('gps-new-entity-place', `latitude: ${randomCoordinates.latitude}; longitude: ${randomCoordinates.longitude}`)
    const randomPosition = getRandomPosition()
    entityElement.setAttribute('position', '0 0 0')

    entityElement.setAttribute('visible', false);

    sceneEl.appendChild(entityElement)

    
    const randomNumber = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
        entityElement.setAttribute('visible', true);
    }, 1 * 1000)

    if (selectedProduct.quantity > 0) {
        selectedProduct.quantity--;
    }
    if (entityElement) {
        if(entityElement.attributes['id'] === 'noi') {
            entityElement.setAttribute('scale', '500 500 500')
        }
        entityElement.setAttribute('gltf-model', selectedProduct.image);

    }
}

  // Hàm update ra ngẫu nhiên vật phẩm nếu nhiều lượt chơi
function updateSelectedProduct() {
    selectedProduct = getRandomProduct();
    performProductActions();
}

  // Sự kiện click
  AFRAME.registerComponent('markerhandler', {
    init: function () {
      this.el.addEventListener('click', () => {
        if (selectedProduct.quantity > 0) {
            showResultModal(selectedProduct);
        } else {
            showResultModal(null);
        }
    });
  }})


   // Khởi tạo 
function initialize() {
  performProductActions();
  
  // const modal = document.getElementById('camera-position-modal');
  // const modalContent = document.getElementById('camera-position-content');
  // if(modalContent) {
  //   modalContent.innerHTML = `Camera Position: Latitude ${currentLocation.latitude}, Longitude ${currentLocation.longitude}`;
  //   modal.style.display = 'block';
  // }
  
  // Set tọa độ camera
  const camera = document.querySelector('a-camera');
  camera.setAttribute('gps-new-camera', `simulateLatitude: ${currentLocation.latitude}; simulateLongitude: ${currentLocation.longitude}`);
}

document.addEventListener('DOMContentLoaded', initialize);


// function showCameraPositionModal(position) {
//     const modal = document.getElementById('camera-position-modal');
//     const modalContent = document.getElementById('camera-position-content');
//     modalContent.innerHTML = `Camera Position: Latitude ${position.latitude.toFixed(6)}, Longitude ${position.longitude.toFixed(6)}`;
//     modal.style.display = 'block';
//   }


// AFRAME.registerComponent('gps-position-listener', {
//   init: function () {
//     // Reference to the camera element
//     const camera = document.querySelector('a-camera');

//     // Add an event listener for positionChanged event
//     camera.addEventListener('positionChanged', (event) => {
//       const newPosition = event.detail.position;
//       console.log('Camera position changed:', newPosition);
//       showCameraPositionModal(newPosition);

//       // Perform actions based on the new position
//       // Example: You can call your existing functions here
//     });
//   }
// });

// Hàm show modal thông báo
function showResultModal(selectedProduct) {
  const modal = document.getElementById('modal');
  const overlay = document.getElementById('overlay');
  const modalContent = document.getElementById('modal-content');

  if (selectedProduct) {
    modalContent.innerHTML = `
        Chúc mừng bạn đã trúng vật phẩm: 
        <span class="red-text">${selectedProduct.name}!</span>
        <div>
            <img src=${selectedProduct.imageUrl} alt="Vật phẩm" />
        </div>
    `;
  } else {
    modalContent.innerHTML = 'Phần thưởng này đã hết, chúc bạn may mắn lần sau!';
  }
    modal.style.display = 'block';
    overlay.style.display = 'block';
}


// Hàm random tọa độ vật phẩm
function getRandomCoordinate() {
    const usePositiveRandomLatitude = Math.random() < 0.5;
    const randomOffsetLatitude = (Math.random() * 0.002) + (usePositiveRandomLatitude ? 0.001 : -0.003);

    const usePositiveRandomLongitude = Math.random() < 0.5;
    const randomOffsetLongitude = (Math.random() * 0.002) + (usePositiveRandomLongitude ? 0.001 : -0.003);

    const currentLatitude = currentLocation.latitude; 
    const currentLongitude = currentLocation.longitude; 
    
    // Calculate the new coordinates by adding the random offset
    const randomLatitude = currentLatitude + randomOffsetLatitude;
    const randomLongitude = currentLongitude + randomOffsetLongitude;
    
    return { latitude: randomLatitude, longitude: randomLongitude };
}


// Set Tọa độ vật phẩm ngẫu nhiên
// function setRandomEntity() {
//     const randomCoordinates = getRandomCoordinate();
//     entity.setAttribute('gps-new-entity-place', `latitude: ${randomCoordinates.latitude}; longitude: ${randomCoordinates.longitude}`);

// }

// hàm random vị trí ngẫu nhiên
function getRandomPosition() {
    const randomX = 0 
    const randomY = Math.floor(Math.random() * 801) - 400; 
    const randomZ = 0  

    // // const entity = document.getElementById('myEntity');
    // if(randomY > 200) {
    //     return `0 40 0`
    //     // entity.setAttribute('rotation', `0 40 0`)
    // } else if(randomY < -200) {
    //     return `0 150 0`// entity.setAttribute('rotation', `0 150 0`)
    // }

    return `${randomX} ${randomY} ${randomZ}`;
}

// set vị trí ngẫu nhiên
// function setRandomEntityPosition() {
//     const entity = document.getElementById('myEntity');
//     const randomPosition = getRandomPosition();
//     entity.setAttribute('position', randomPosition);
// }


// Hàm khi đóng modal
function closeModal() {
    const modal = document.getElementById('modal');
    const overlay = document.getElementById('overlay');
    
    modal.style.display = 'none';
    overlay.style.display = 'none';

    const entityElement = document.getElementById("myEntity")
    entityElement.remove()

    // mỗi lần gọi hàm là một lượt chơi mới
    updateSelectedProduct()

    // setRandomEntityPosition()
    // setRandomEntity();

}

// document.addEventListener('DOMContentLoaded', setRandomEntity);
// document.addEventListener('DOMContentLoaded', setRandomEntityPosition);
