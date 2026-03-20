import Foundation
import SwiftUI

enum Lane: Int, CaseIterable, Identifiable {
    case left = 0
    case center = 1
    case right = 2

    var id: Int { rawValue }
    var title: String {
        switch self {
        case .left: return "Left"
        case .center: return "Center"
        case .right: return "Right"
        }
    }
}

enum EncounterType: CaseIterable {
    case zombie
    case wall
    case crate
}

struct Encounter: Identifiable {
    let id = UUID()
    let lane: Lane
    let type: EncounterType
    var hitPoints: Int
    var reward: Int
    var progress: Double
}

struct RunStats {
    var squad: Int = 8
    var firepower: Int = 1
    var distance: Int = 0
    var wave: Int = 1
    var bestDistance: Int = 0
}

struct ReleaseConfig {
    let appName = "Zombie Squad Run"
    let bundleId = "com.zombiesquadrun.game"
    let version = "1.0"
    let build = "1"
}
