import { User } from "lucide-react";
import SettingSection from "./SettingSection";

export default function Profile({ profileData, handleOpenModal }) {
	return (
		<SettingSection icon={User} title={"Profile"}>
			<div className='flex flex-col sm:flex-row items-center mb-6'>
				<img
					src={profileData.image}
					alt='Profile'
					className='rounded-full w-20 h-20 object-cover mr-4'
				/>

				<div>
					<h3 className='text-lg font-semibold text-gray-100'>{profileData.name}</h3>
					<p className='text-gray-400'>{profileData.email}</p>
				</div>
			</div>

			<button 
				onClick={handleOpenModal}
				className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto'
			>
				Chỉnh sửa Profile
			</button>
		</SettingSection>
	);
}