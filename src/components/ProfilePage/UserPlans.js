import React, { useState, useEffect, useRef } from 'react';
import './ProfilePage.css';
import './CreatePost.css';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CSSTransition } from 'react-transition-group';

const tagsList = ['Long-term', 'Post-Grad', 'Maybe', 'Dream'];

const PlanWithMap = ({ plan }) => {
    const mapContainerRef = useRef(null); // Creates a ref for the map container

    useEffect(() => {
        const map = new mapboxgl.Map({
        container: mapContainerRef.current, // Reference to the div element
        style: 'mapbox://styles/mapbox/streets-v12', // Style URL from Mapbox
        center: [parseFloat(plan.long), parseFloat(plan.lat)], // Center the map on the plan coordinates
        zoom: 12 // Starting zoom level
        });

        // Add a pin to the plan location
        new mapboxgl.Marker()
        .setLngLat([parseFloat(plan.long), parseFloat(plan.lat)])
        .addTo(map);

        //remove the ability to zoom in and out
        map.scrollZoom.disable();

        // Cleanup function to remove the map
        return () => map && map.remove();
    }, [plan.lat, plan.long]);

    const tags = plan.tags.split(',').map(tag => tag.trim());

    return (
        <div className="profile-card">
        <div className="profile-details">
            <h4>{plan.neighborhood} - {plan.city}, {plan.state}</h4>
            <div ref={mapContainerRef} className="map-container" style={{ height: '300px' }} />
            <p className="profile-about">{plan.desc}</p>
                <div className="tags-selection">
                    {tags.map((tag, index) => (
                        <button key={tag} className={"tag"}>
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

function CreatePost({ addNewPlan }) {
    const [selectedTags, setSelectedTags] = useState([]);
    const [coordinates, setCoordinates] = useState({ lat: null, long: null });
    const searchInputRef = useRef(null);
    const mapContainerRef = useRef(null); 

    const [city , setCity] = useState('');
    const [state, setState] = useState('');
    const [planDescription, setPlanDescription] = useState('');
    const [postTitle, setPostTitle] = useState(''); 
    const [isPosted, setIsPosted] = useState(false);

    // Function to handle the creation of a new plan when the "Post" button is clicked
    const handlePostClick = () => {
        if (coordinates.lat && coordinates.long) {
            setIsPosted(true);
        }
    };

    // Add and remove the 'shrink' class based on 'isPosted'
    const profileCardClass = `profile-card ${isPosted ? 'shrink' : ''}`;

    const handleFinalPost = () => {
        const newPlan = {
            planID: Date.now(),
            neighborhood: postTitle,
            city: city.trim(), 
            state: state.trim(), 
            lat: coordinates.lat.toString(),
            long: coordinates.long.toString(),
            tags: selectedTags.join(', '), 
            desc: planDescription, 
        };

        addNewPlan(newPlan);

        // Reset all states
        setPlanDescription('');
        setPostTitle('');
        setSelectedTags([]);
        setCoordinates({ lat: null, long: null });
        setIsPosted(false); // Reset isPosted to allow for new posts

        if (searchInputRef.current) {
            searchInputRef.current.value = '';
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault(); 
        handleLocationSearch(); 
    };

    // Function to handle location search
    const handleLocationSearch = async () => {
        const query = searchInputRef.current.value;
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`);
        const data = await response.json();
        const place = data.features[0];

        console.log(place);

        if (place) {
            setCoordinates({ lat: place.center[1], long: place.center[0] });

            // Loop through the context to find city and state
            place.context.forEach((item) => {
                if (item.id.startsWith('place.')) {
                    setCity(item.text);
                }
                if (item.id.startsWith('region.')) { 
                    setState(item.text);
                }
            });
        }
    };

    useEffect(() => {
        if (coordinates.lat && coordinates.long) { // Only proceed if coordinates are valid
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [coordinates.long, coordinates.lat], // Center the map on the coordinates
                zoom: 12
            });

            // Add a pin to the location
            new mapboxgl.Marker()
                .setLngLat([coordinates.long, coordinates.lat])
                .addTo(map);

            // Disable zoom and drag controls
            map.scrollZoom.disable();
            map.dragPan.disable();

            // Clean up on unmount
            return () => map.remove();
        }
    }, [coordinates]);

    // Function to toggle tag selection
    const toggleTagSelection = (tag) => {
        setSelectedTags(prevSelectedTags =>
            prevSelectedTags.includes(tag)
                ? prevSelectedTags.filter(t => t !== tag)
                : [...prevSelectedTags, tag]
        );
    };

    return (
        <div>
            <CSSTransition
                in={!isPosted}
                timeout={500}
                classNames="details-transition"
                unmountOnExit
                onEnter={() => console.log("Entering")}
                onExited={() => console.log("Exited - Not Posted")}
            > 
                <div className={profileCardClass}>
                    <div className="profile-details">
                        <div className="create-post-header">Where's your next leap?</div>
                        <div className="location-search">
                            <form onSubmit={handleFormSubmit}>
                                <input ref={searchInputRef} type="text" placeholder="Search for a location" />
                                <button type="submit" className="search button">Search</button>
                            </form>
                        </div>
                        {coordinates.lat && coordinates.long && (
                            <div style={{marginTop: '10px'}}>
                                <div className="map-desc">
                                    <div className="location-result">
                                        <div ref={mapContainerRef} className="map-container in-post" style={{ height: '200px' }} />
                                    </div>
                                    <div className="user-input-area">
                                        <textarea
                                            value={planDescription}
                                            onChange={(e) => setPlanDescription(e.target.value)}
                                            placeholder="Why are you going?"
                                        />
                                    </div>
                                </div>
                                <div className="bottom-row">
                                    <div className="tags-selection">
                                        {tagsList.map((tag) => (
                                            <button key={tag} className={selectedTags.includes(tag) ? 'tag tag-active' : 'tag'} onClick={() => toggleTagSelection(tag)}>
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                    <button className="post button" onClick={handlePostClick}>Next</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CSSTransition>

            <CSSTransition
                in={isPosted}
                timeout={500}
                classNames="post-transition"
                unmountOnExit
                onEnter={() => console.log("Entering Post")}
                onExited={() => {
                    console.log("Exited - Posted");
                    setIsPosted(false); // This is crucial to trigger the switch back
                }}
            >
                
                <div className={profileCardClass}>
                    <div className="profile-details">
                        <div className="create-post-header">Your next leap to {city}, {state}!</div>
                        <div className="location-search">
                            <input 
                                type="text" 
                                value={postTitle} 
                                onChange={(e) => setPostTitle(e.target.value)} 
                                placeholder="Enter a title for your post" 
                            />
                            <button onClick={handleFinalPost} className="search button">POST</button>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
}

export {PlanWithMap, CreatePost};