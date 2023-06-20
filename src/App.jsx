import React, { useEffect, useRef, useState } from 'react';
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMap,
	useMapEvent,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapEvents } from 'https://cdn.esm.sh/react-leaflet/hooks';

function App() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	let ip = '';
	let input = '';

	const getIpDetails = async () => {
		try {
			const response = await fetch(
				`https://geo.ipify.org/api/v2/country,city?apiKey=at_2Oyy8n2RfN1g8VjSIz8UwqItQJn10&ipAddress=${ip}`
			);

			if (!response.ok) {
				alert(`This is an HTTP error: this Status is ${response.status}`);
				throw new Error(
					`This is an HTTP error: this Status is ${response.status} `
				);
			}
			let data = await response.json();
			console.log(data);
			setData(data);
			setError(null);
		} catch (err) {
			setError(err.message);
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	// const position = [7.57, 18];
	const position = [data?.location?.lat || 7.57, data?.location?.lng || 18];

	return (
		<div className={`bg-[url('./assets/bg-desktop.png')] bg-cover pt-[100px]`}>
			<div className="relative w-[85%] px-[20px] grid m-auto text-center gap-10 ">
				<h1 className={`text-white font-semibold text-[24px] `}>
					IP Address Tracker
				</h1>
				<form
					action=""
					onSubmit={e => {
						e.preventDefault();
						if (input == '0.0.0.0') {
							ip = '';
						} else {
							ip = input;
						}

						// map();
					}}>
					<span
						className={`flex justify-between items-center rounded-[10px] h-[60px] w-[100%] lg:w-[50%] m-auto bg-white overflow-hidden mb-20`}>
						<input
							placeholder="192.212.234.21"
							name="ip"
							required
							className="w-[85%] bg-transparent outline-none px-[20px]"
							onChange={e => {
								input = e.target.value;
							}}
						/>
						<button
							type="submit"
							className={`bg-textColor w-[20%] h-full flex items-center justify-center text-[20px] text-white font-extrabold`}>
							{'>'}
						</button>
					</span>
				</form>
				{loading || data === null ? (
					<div
						className={`absolute bg-white  w-full rounded-[10px] gap-10 grid p-[10px] py-[30px] md:flex md:flex-wrap items-center justify-center shadow-lg shadow-hoverColor-500 top-[80%] z-[999]`}>
						<span className={`grid gap-0 text-start pr-10 md:border-r-2 `}>
							<small className={`text-[14px] text-hoverColor font-semibold`}>
								IP ADDRESS
							</small>
							<h2 className={`text-textColor text-[24px] font-semibold`}>
								192.168.0.5
							</h2>
						</span>
						<span className={`grid gap-0 text-start pr-10 md:border-r-2 `}>
							<small className={`text-[14px] text-hoverColor font-semibold`}>
								LOCATION
							</small>
							<h2 className={`text-textColor text-[24px] font-semibold block`}>
								Lagos, Nigeria
							</h2>
						</span>
						<span className={`grid gap-0 text-start pr-10 lg:border-r-2 `}>
							<small className={`text-[14px] text-hoverColor font-semibold`}>
								TIME ZONE
							</small>
							<h2 className={`text-textColor text-[24px] font-semibold`}>
								-7:00
							</h2>
						</span>
						<span className={`grid gap-0 text-start  `}>
							<small className={`text-[14px] text-hoverColor font-semibold`}>
								ISP
							</small>
							<h2 className={`text-textColor text-[24px] font-semibold`}>
								Google LCC
							</h2>
						</span>
					</div>
				) : (
					<div
						className={`absolute bg-white  w-full rounded-[10px] gap-10 grid p-[10px] py-[30px] md:flex md:flex-wrap items-center justify-center shadow-lg shadow-hoverColor-500 top-[80%] z-[999]`}>
						<span className={`grid gap-0 text-start pr-10 md:border-r-2 `}>
							<small className={`text-[14px] text-hoverColor font-semibold`}>
								IP ADDRESS
							</small>
							<h2 className={`text-textColor text-[24px] font-semibold`}>
								{data?.ip}, {data?.location?.lat}
							</h2>
						</span>
						<span className={`grid gap-0 text-start pr-10 md:border-r-2 `}>
							<small className={`text-[14px] text-hoverColor font-semibold`}>
								LOCATION
							</small>
							<h2 className={`text-textColor text-[24px] font-semibold block`}>
								{data?.location?.city}, {data?.location?.country}
							</h2>
						</span>
						<span className={`grid gap-0 text-start pr-10 lg:border-r-2 `}>
							<small className={`text-[14px] text-hoverColor font-semibold`}>
								TIME ZONE
							</small>
							<h2 className={`text-textColor text-[24px] font-semibold`}>
								{data?.location?.timezone}
							</h2>
						</span>
						<span className={`grid gap-0 text-start  `}>
							<small className={`text-[14px] text-hoverColor font-semibold`}>
								ISP
							</small>
							<h2 className={`text-textColor text-[24px] font-semibold`}>
								{data?.isp}
							</h2>
						</span>
					</div>
				)}
			</div>
			<div style={{ overflow: 'hidden' }}>
				<MapContainer
					center={position}
					zoom={13}
					scrollWheelZoom={false}
					style={{ height: '100vh', width: '100wh' }}>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<Marker position={position} style={{ backgoundColor: 'black' }}>
						<Popup>{data?.location?.city || 'Lagos'}</Popup>
					</Marker>
					<RecenterAutomatically lat={position[0]} lng={position[1]} />
				</MapContainer>
			</div>
		</div>
	);
}

const RecenterAutomatically = ({ lat, lng }) => {
	const map = useMap();
	useEffect(() => {
		map.setView([lat, lng]);
	}, [lat, lng]);
	return null;
};

export default App;
