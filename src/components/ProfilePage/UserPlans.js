import React, { useState, useEffect, useRef } from 'react';
import './CSS/ProfilePage.css';
import './CSS/CreatePost.css';
import './CSS/Attributes.css';
import { createPost, deletePlan } from './api';

import trashIcon from './icons/trash.png';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const tagsList = ['Long-term', 'Post-Grad', 'Maybe', 'Dream'];

const PlanWithMap = ({ plan, activeTab, onDelete, userProfile, loggedInUid }) => {
    const mapContainerRef = useRef(null); // Creates a ref for the map container
    const mapRef = useRef(null); // Reference to the map instance

    useEffect(() => {
        if (mapContainerRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current, // Reference to the div element
                style: 'mapbox://styles/mapbox/streets-v12', // Style URL from Mapbox
                center: [parseFloat(plan.long), parseFloat(plan.lat)], // Center the map on the plan coordinates
                zoom: 12 // Starting zoom level
            });

            // Add a pin to the plan location
            new mapboxgl.Marker()
                .setLngLat([parseFloat(plan.long), parseFloat(plan.lat)])
                .addTo(mapRef.current);

            // Remove the ability to zoom in and out
            mapRef.current.scrollZoom.disable();

            // Ensure the map is fully loaded before calling resize
            mapRef.current.on('load', () => {
                if (mapRef.current) {
                    mapRef.current.resize();
                }
            });
        }

        // Cleanup function to remove the map
        return () => mapRef.current && mapRef.current.remove();
    }, [plan.lat, plan.long]);

    useEffect(() => {
        setTimeout(() => {
            mapRef.current.resize();
        }, 210);
    }, [activeTab]);

    const tags = plan.tags.split(',').map(tag => tag.trim());

    const handleDelete = async () => {
        const result = await deletePlan(plan.planID);
        if (result.success) {
            onDelete(plan.planID);
        } else {
            console.error('Failed to delete plan:', result.message);
        }
    };

    return (
        <div className="profile-card">
            <div className="post-details">
                <div className="post-header">
                    <h4>{plan.title} - {plan.city}, {plan.state}</h4>
                    {loggedInUid === userProfile.uid && (
                        <button onClick={handleDelete} className="modern-button trash-button">
                            <img src={trashIcon} alt="Trash" id="icon-trash"/>
                        </button>
                    )}
                </div>
                <div ref={mapContainerRef} className="map-container" style={{ height: '300px' }} />
                <p className="post-about grey font-size-xs font-weight-600">
                    {plan.desc}
                </p>
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

function CreatePost({ addNewPlan, loggedInUid, userProfile }) {
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

    const handleFinalPost = async () => {
        const newPlan = {
            uid: loggedInUid,
            title: postTitle,
            city: city.trim(),
            state: state.trim(),
            lat: coordinates.lat.toString(),
            long: coordinates.long.toString(),
            tags: selectedTags.join(', '),
            desc: planDescription,
        };

        const result = await createPost(newPlan);

        if (result.success) {
            addNewPlan(newPlan);

            // Reset all states
            setPlanDescription('');
            setPostTitle('');
            setSelectedTags([]);
            setCoordinates({ lat: null, long: null });
            setIsPosted(false);

            if (searchInputRef.current) {
                searchInputRef.current.value = '';
            }
        } else {
            console.error('Failed to create post:', result.message);
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

        if (place) {
            setCoordinates({ lat: place.center[1], long: place.center[0] });

            console.log(place);
            
            if (place.place_type.includes('neighborhood') || place.place_type.includes('address') || place.place_type.includes('poi')) {
                // Loop through the context to find city and state
                place.context.forEach((item) => {
                    if (item.id.startsWith('place.')) {
                        setCity(item.text);
                    }
                    if (item.id.startsWith('region.')) { 
                        setState(item.text);
                    }
                });
            } else { 
                setCity(place.place_name.split(',')[0]);
                setState(place.place_name.split(',')[1].trim());
            }
        }
    };

    useEffect(() => {
        if (coordinates.lat && coordinates.long) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [coordinates.long, coordinates.lat], 
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

    if (loggedInUid !== userProfile.uid) {
        return null;
    }

    return (
        <div className={`profile-card`}>
            <div className={`post-details ${isPosted ? 'reveal' : 'hidden'}`}>
                <div className="create-post-header font-weight-800 font-size-sm">
                    Your next leap to {city}, {state}!
                </div>
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

            <div className={`post-details ${isPosted ? 'shrink' : ''}`}>
                <div className="create-post-header font-weight-800 font-size-sm">
                    Where's your next leap?
                </div>
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
    );
}

export {PlanWithMap, CreatePost};