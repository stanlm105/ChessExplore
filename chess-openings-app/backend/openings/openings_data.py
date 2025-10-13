"""Static data and helpers for opening sets.

Exports: Opening, get_openings(set_name) -> list[dict]
"""
from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import List, Dict, Any


@dataclass(frozen=True)
class Opening:
    """A chess opening with a name, SAN move list, and a brief description."""

    name: str
    moves: List[str]
    description: str

    def to_dict(self) -> Dict[str, Any]:
        """Serialize to a JSON-safe dict."""
        return asdict(self)


# Starter Opening Set
STARTER_OPENINGS: List[Opening] = [
    Opening("Ruy Lopez", ["e4", "e5", "Nf3", "Nc6", "Bb5"], "Classic central control and pressure on c6."),
    Opening("Sicilian Defense", ["e4", "c5"], "Dynamic counter to 1.e4 aiming for imbalanced play."),
    Opening("French Defense", ["e4", "e6"], "Solid structure with ...d5 challenging the center."),
    Opening("Caro-Kann Defense", ["e4", "c6"], "Healthy structure; Black strikes with ...d5."),
    Opening("Italian Game", ["e4", "e5", "Nf3", "Nc6", "Bc4"], "Rapid development and pressure on f7."),
    Opening("Queen's Gambit", ["d4", "d5", "c4"], "Offer a pawn to deflect ...d5 and gain space."),
    Opening("King's Indian Defense", ["d4", "Nf6", "c4", "g6"], "Hypermodern: concede center, strike later."),
    Opening("English Opening", ["c4"], "Flexible flank opening, often transposes."),
    Opening("Nimzo-Indian Defense", ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4"], "Pressure on c3; doubled pawns themes."),
    Opening("Scotch Game", ["e4", "e5", "Nf3", "Nc6", "d4"], "Open lines and tactical play."),
]

# Level 2 Set
LEVEL2_OPENINGS: List[Opening] = [
    Opening("Grünfeld Defense", ["d4", "Nf6", "c4", "g6"],
            "A dynamic hypermodern defense where Black attacks White's center with ...d5 later."),
    Opening("Benoni Defense", ["d4", "Nf6", "c4", "e6"],
            "A sharp Indian-style setup aiming for counterplay on dark squares and queenside."),
    Opening("Pirc Defense", ["e4", "d6"],
            "Flexible, hypermodern setup for Black; invites White to build a center first."),
    Opening("Dutch Defense", ["d4", "f5"],
            "Fights immediately for e4 and kingside play; leads to asymmetrical middlegames."),
    Opening("Alekhine's Defense", ["e4", "Nf6"],
            "Provocative: Black tempts White to overextend the center, then attacks it."),
    Opening("Catalan Opening", ["d4", "Nf6", "c4", "e6", "g3"],
            "Queen's Gambit + fianchetto: long-term pressure on the dark squares and queenside."),
    Opening("King's Gambit", ["e4", "e5", "f4"],
            "Romantic-era gambit for rapid development and open f-file tactics."),
    Opening("Evans Gambit", ["e4", "e5", "Nf3", "Bc5", "b4"],
            "White gambits a pawn to gain time on the bishop and seize the initiative."),
    Opening("Two Knights Defense", ["e4", "e5", "Nf3", "Nc6", "Bc4"],
            "Leads to tactical skirmishes (e.g., Fried Liver motifs) and open play."),
    Opening("Scandinavian Defense", ["e4", "d5"],
            "Direct challenge to the center; early queen activity and solid structure."),

    # Added core-meta lines:
    Opening("Queen's Gambit Declined", ["d4", "d5", "c4", "e6"],
            "Classical response to 1.d4—solid central structure and rich strategic play."),
    Opening("Slav Defense", ["d4", "d5", "c4", "c6"],
            "Rock-solid defense to the QG; aims for sturdy pawn structure and counterplay."),
    Opening("Petroff (Russian) Defense", ["e4", "e5", "Nf3", "Nf6"],
            "Ultra-reliable 1.e4 defense focused on symmetry and early central exchanges."),
    Opening("Berlin Defense (Ruy Lopez)", ["e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6"],
            "Elite-level mainstay; trades queens early and tests White’s endgame technique."),
    Opening("London System", ["d4", "Nf6", "Nf3", "e6", "Bf4"],
            "Club favorite: quick development with Bf4; resilient and plan-based."),
    Opening("Sicilian Najdorf", ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"],
            "Iconic Sicilian branch—flexible, dynamic positions with rich theory."),
]

# Wacky Set
WACKY_OPENINGS: List[Opening] = [
    Opening("Bongcloud Attack", ["e4", "e5", "Ke2"],
            "The infamous king walk—high on meme value, low on theory."),
    Opening("Halloween Gambit", ["e4", "e5", "Nf3", "Nc6", "Nc3", "Nf6", "Nxe5", "Nxe5", "d4"],
            "From the Four Knights: sac a knight for central space and initiative."),
    Opening("Stafford Gambit", ["e4", "e5", "Nf3", "Nf6", "Nxe5", "Nc6"],
            "Viral Petrov trap for Black with quick tactics on f2/f7."),
    Opening("Wayward Queen Attack", ["e4", "e5", "Qh5", "Nc6", "Bc4"],
            "Early Qh5 aiming at f7—can transpose to Scholar’s motifs."),
    Opening("Grob Attack", ["g4", "d5", "Bg2"],
            "1.g4!?—offbeat flank thrust; invites chaos and counterplay."),
    Opening("Orangutan (Sokolsky) Opening", ["b4", "e5", "Bb2"],
            "1.b4—queenside lunge with flexible ideas; named after an orangutan."),
    Opening("Danish Gambit", ["e4", "e5", "d4", "exd4", "c3"],
            "Sac pawns for rapid development and open lines at f7."),
    Opening("Englund Gambit", ["d4", "e5"],
            "Cheeky response to 1.d4; immediate central gambit by Black."),
    Opening("Latvian Gambit", ["e4", "e5", "Nf3", "f5"],
            "Ultra-aggressive counter; sharp tactics from move two."),
    Opening("Fried Liver Attack", ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5", "d5", "exd5"],
            "Classic sac ideas on f7 from the Two Knights."),
    Opening("Elephant Gambit", ["e4", "e5", "Nf3", "d5"],
            "Bold central counter after 2.Nf3; practical surprise weapon."),
    Opening("Scotch Gambit", ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Bc4"],
            "Open, tactical positions with fast development for White."),
]

_SETS: Dict[str, List[Opening]] = {
    "Starter Opening Set": STARTER_OPENINGS,
    "Level 2 Set": LEVEL2_OPENINGS,
    "Wacky Set": WACKY_OPENINGS,
}


def get_openings(set_name: str) -> List[Dict[str, Any]]:
    """Return an opening list for the given canonical set name.

    Args:
        set_name: Canonical set name (e.g., 'Starter Opening Set').

    Returns:
        A list of dictionaries suitable for JSON serialization. Returns an empty
        list if the set name is unknown.
    """
    openings = _SETS.get(set_name, [])
    return [o.to_dict() for o in openings]


__all__ = ["Opening", "get_openings"]