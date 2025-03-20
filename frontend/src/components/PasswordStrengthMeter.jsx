import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }) => {
	const criteria = [
		{ label: "Minimal 6 karakter", met: password.length >= 6 },
		{ label: "Ada huruf besar", met: /[A-Z]/.test(password) },
		{ label: "Ada huruf kecil", met: /[a-z]/.test(password) },
		{ label: "Ada angka", met: /\d/.test(password) },
		{ label: "Ada simbol spesial", met: /[^A-Za-z0-9]/.test(password) },
	];

	return (
		<div className='mt-2 space-y-1'>
			{criteria.map((item) => (
				<div key={item.label} className='flex items-center text-xs'>
					{item.met ? (
						<Check className='size-4 text-[#66B2D6] mr-2' /> // Biru Pastel buat tanda cek
					) : (
						<X className='size-4 text-[#A8A8A8] mr-2' /> // Abu-Abu Medium buat tanda silang
					)}
					<span className={item.met ? "text-[#66B2D6]" : "text-[#A8A8A8]"}>{item.label}</span>
				</div>
			))}
		</div>
	);
};

const PasswordStrengthMeter = ({ password }) => {
	const getStrength = (pass) => {
		let strength = 0;
		if (pass.length >= 6) strength++;
		if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
		if (pass.match(/\d/)) strength++;
		if (pass.match(/[^a-zA-Z\d]/)) strength++;
		return strength;
	};
	const strength = getStrength(password);

	const getColor = (strength) => {
		if (strength === 0) return "bg-[#BF5F5F]"; // Merah Marun (Sangat Lemah)
		if (strength === 1) return "bg-[#F4F4F4]"; // Merah Muda Cerah (Lemah)
		if (strength === 2) return "bg-[#3FA3CE]"; // Putih Abu-Abu (Sedang)
		if (strength === 3) return "bg-[#145C75]"; // Biru Muda (Baik)
		return "bg-[#FF9999]"; // Biru Tua (Kuat)
	};

	const getStrengthText = (strength) => {
		if (strength === 0) return "Sangat Lemah";
		if (strength === 1) return "Lemah";
		if (strength === 2) return "Lumayan";
		if (strength === 3) return "Bagus";
		return "Kuat";
	};

	return (
		<div className='mt-2'>
			<div className='flex justify-between items-center mb-1'>
				<span className='text-xs text-[#828282]'>Kekuatan password</span>
				<span className='text-xs text-[#828282]'>{getStrengthText(strength)}</span>
			</div>

			<div className='flex space-x-1'>
				{[...Array(4)].map((_, index) => (
					<div
						key={index}
						className={`h-1 w-1/4 rounded-full transition-colors duration-300 
                ${index < strength ? getColor(strength) : "bg-[#CCCCCC]"} // Abu-Abu Netral buat yang kosong
              `}
					/>
				))}
			</div>
			<PasswordCriteria password={password} />
		</div>
	);
};
export default PasswordStrengthMeter;
