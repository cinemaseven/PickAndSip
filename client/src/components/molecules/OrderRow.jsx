import { X } from 'lucide-react';
import StarRating from '../atoms/StarRating';

export default function OrderRow({ order, onChange, onRemove }) {
    return (
        <div className="order-row">
            <div className="order-inputs">
                <input aria-label="Order item" placeholder="Order item" value={order.item} onChange={e => onChange({ ...order, item: e.target.value })}/>
                <label className="price-input">
                    <span>₱</span>
                    <input aria-label="Order price" type="number" min="0" value={order.price} onChange={e => onChange({ ...order, price: e.target.value })}/>
                </label>
            </div>
            <div className="order-rating">
                <span>Rating</span>
                <StarRating value={Number(order.rating)} onChange={rating => onChange({ ...order, rating })} size={21} label={false}/>
                <button className="remove-order" type="button" aria-label="Remove order" onClick={onRemove}>
                <X size={15}/>
                </button>
            </div>
        </div>
    );
}
