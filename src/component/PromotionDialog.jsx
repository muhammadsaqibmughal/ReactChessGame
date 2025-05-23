
import PropTypes from "prop-types";
import "../styles/PromotionDialog.css";


const pieces = [
  { type: "q", label: "Queen" },
  { type: "r", label: "Rook" },
  { type: "b", label: "Bishop" },
  { type: "n", label: "Knight" },
];

const getImageSrc = (color, type) =>
  `/pieces/${color}${type.toUpperCase()}.svg`;

const PromotionDialog = ({ color, onSelect }) => (
  <div className="promotion-dialog-backdrop">
    <div className="promotion-dialog-rectangle">
      {pieces.map((piece) => (
        <button
          key={piece.type}
          className="promotion-dialog-btn"
          onClick={() => onSelect(piece.type)}
          title={piece.label}
        >
          <img
            src={getImageSrc(color === "w" ? "w" : "b", piece.type)}
            alt={piece.label}
            className="promotion-piece-img"
          />
        </button>
      ))}
    </div>
  </div>
);

PromotionDialog.propTypes = {
  color: PropTypes.oneOf(["w", "b"]).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default PromotionDialog;
