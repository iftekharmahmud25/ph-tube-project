document.addEventListener('DOMContentLoaded', () => {
    const handleNavigateToBlog = () => {
        // Redirect to the blog.html page
        window.location.href = 'blog.html';
    };

    // Event listener for the "Home" button on the blog page
    const blogBtn = document.getElementById('blogBtn');
    if (blogBtn) {
        blogBtn.addEventListener('click', handleNavigateToBlog);
    }

    const handleNavigateToHome =()=>{
        window.location.href = 'index.html';
    }

    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', handleNavigateToHome);
    }

    const handleSortByViews = () => {
        const cardContainer = document.getElementById('card-container');
        const cards = Array.from(cardContainer.children);

        const sortedCards = cards.sort((a, b) => {
            const viewsA = parseInt(a.querySelector('.text-gray-400.text-sm').textContent);
            const viewsB = parseInt(b.querySelector('.text-gray-400.text-sm').textContent);
            return viewsB - viewsA; 
        });

        cardContainer.innerHTML = ''; 
        sortedCards.forEach(card => cardContainer.appendChild(card));
    };

    function formatTime(timestamp) {
        const hours = Math.floor(timestamp / 3600);
        const minutes = Math.floor((timestamp % 3600) / 60);

        const hoursDisplay = hours > 0 ? `${hours} hr` : '';
        const minutesDisplay = minutes > 0 ? `${minutes} min` : '';
        return `${hoursDisplay} ${minutesDisplay} `;
    }

    const handleCategory = async () => {
        const response = await fetch('https://openapi.programming-hero.com/api/videos/categories');
        const data = await response.json();
        const tabContainer = document.getElementById('tab-container');
        
        data.data.forEach((category) => {
            const div = document.createElement('div');
            const link = document.createElement('a');
            link.classList.add('tab', 'btn', 'bg-gray-400', 'text-white', 'ml-2', 'mb-6', 'btn-sm');
            link.textContent = category.category;
    
            link.addEventListener('click', () => {
                handleLoadVideos(category.category_id);
            });
    
            div.appendChild(link);
            tabContainer.appendChild(div);
    
         
            link.addEventListener('click', () => {
                const tabs = document.querySelectorAll('.tab');
                tabs.forEach(tab => tab.classList.remove('bg-red-500'));
                link.classList.add('bg-red-500');
            });
        });
    }
    

    const handleLoadVideos = async (categoryId) => {
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`);
        const data = await response.json();
        const cardContainer = document.getElementById('card-container');
        console.log('cardContainer:', cardContainer);
        cardContainer.innerHTML = '';
        if (data.data.length === 0) {
            const noDataDiv = document.createElement('div');
             noDataDiv.classList.add('flex', 'flex-col-reverse' )
            const noDataImage = document.createElement('img');
            noDataImage.src = './images/Icon.png' ; 
            noDataImage.alt = 'No Data Available' ;
            noDataDiv.innerHTML =    `<h1 class="font-bold text-2xl">Oops!! Sorry, There is no content here </h1>`
            noDataDiv.appendChild(noDataImage);
            
            
            cardContainer.appendChild(noDataDiv);
            
        } else {
            data.data.forEach((videos) => {
                const div = document.createElement('div');
                div.innerHTML = `
            <div class="card lg:w-56 md:w-72 w-64 h-64 bg-base-100 shadow-xl"> 
                         <div class='relative'>
                    <figure>
                         <img class="w-full h-36 rounded-md" src=${videos.thumbnail} alt="Shoes" />
                        </figure>
                        <div class='absolute top-[120px] '>${videos?.others?.posted_date ? `<div class='w-full text-xs bg-black text-white rounded-md p-1 border-none'>${formatTime(parseInt(videos.others.posted_date))} ago</div>` : ''} 
                        </div>
                        </div>
            
                       <div class="ps-1">
                        <div class="flex gap-3 ">
                           <div>
                            <img class="rounded-full w-8 mt-2 h-8" src=${videos?.authors[0]?.profile_picture} alt="author picture">
                            </div>
            
                           <div>
                         <p class='font-bold text-lg'>${videos?.title}</p>
                          <div class="flex gap-1 items-center">
                       <p class='text-gray-400 text-base'>${videos?.authors[0]?.profile_name}</p>
                       <div>${videos?.authors[0]?.verified ? '<i class="fa-solid fa-circle-check text-blue-400"></i>' : ""}</div>
                           </div>
                           <p class='text-gray-400 text-sm'>${videos.others.views} Views </p>
                           </div>
                           <div>
            
                          
                           </div>
                        </div>
              
             
                   </div>
                    
                    </div>`;
                cardContainer.appendChild(div);
            });
        }
        console.log('data:', data);

    }
    
    const sortBtn = document.getElementById('sortBtn');
    sortBtn.addEventListener('click', handleSortByViews);

    handleCategory()
    handleLoadVideos("1000")
})





