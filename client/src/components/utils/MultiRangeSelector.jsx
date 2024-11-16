import { useEffect, useState } from "react";

const MultiRangeSelector = ({
	min,
	max,
	isMinMaxFieldExist,
	handleApply,
	is_location,
	maxAmount = 10000,
	step = 100,
}) => {
	const [minPrice, setMinPrice] = useState(parseInt(min) || 0);
	const [maxPrice, setMaxPrice] = useState(parseInt(max) || maxAmount);
	const minPercentage = (minPrice / maxAmount) * 100;
	const maxPercentage = (maxPrice / maxAmount) * 100;

	const handleRangeChange = (e, type) => {
		const value = e.target.value;

		const isNumeric = /^[0-9]*$/.test(value);
		const numericValue = parseInt(value);
		const isWithinRange = numericValue <= maxAmount;

		if ((isNumeric && isWithinRange) || value === "") {
			if (type === "min") {
				setMinPrice(value === "" ? 0 : numericValue);
			} else {
				setMaxPrice(value === "" ? 0 : numericValue);
			}
		}
	};

	useEffect(() => {
		setMinPrice(parseInt(min));
		setMaxPrice(parseInt(max));
	}, [min, max]);

	return (
		<div>
			<div className="opacity-70 transition-all ease-in-out hover:opacity-100 ">
				<div className="flex items-center justify-between pb-2 text-sm">
					<span>{!is_location ? `Rs ${minPrice}` : `${minPrice} km`}</span>
					<span>{!is_location ? `Rs ${maxPrice}` : `${maxPrice} km`}</span>
				</div>
				<div className="range-slider">
					<div
						className="progress"
						style={{ left: `${minPercentage}%`, right: `${100 - maxPercentage}%` }}
					></div>
				</div>

				<div className="range-input">
					<input
						type="range"
						className="range-min"
						min="0"
						max={maxAmount}
						value={minPrice}
						step={`${step}`}
						onChange={(e) => handleRangeChange(e, "min")}
						onMouseUp={() => handleApply(minPrice, maxPrice)}
					/>
					<input
						type="range"
						className="range-max"
						min="0"
						max={maxAmount}
						value={maxPrice}
						step={step}
						onChange={(e) => handleRangeChange(e, "max")}
						onMouseUp={() => handleApply(minPrice, maxPrice)}
					/>
				</div>
			</div>
			{isMinMaxFieldExist && (
				<div className="my-4 flex w-full items-center gap-2">
					Min
					<div className="flex items-center gap-1 rounded-md border border-dark px-4 ">
						Rs
						<input
							type="text"
							value={minPrice}
							onChange={(e) => handleRangeChange(e, "min")}
							className="h-full w-10 py-1 text-sm  outline-none"
						/>
					</div>
					<div className="">-</div>
					Max
					<div className="flex items-center gap-1 rounded-md border border-dark px-4 ">
						Rs
						<input
							type="text"
							value={maxPrice}
							onChange={(e) => handleRangeChange(e, "max")}
							className="h-full w-10 rounded-sm py-1 text-sm outline-none"
						/>
					</div>
					{/* <button */}
					{/* 	className="flex items-center rounded-full bg-primary p-2 px-4" */}
					{/* > */}
					{/* 	<p className="text-sm text-white">Apply</p> */}
					{/* </button> */}
				</div>
			)}{" "}
		</div>
	);
};

export default MultiRangeSelector;
