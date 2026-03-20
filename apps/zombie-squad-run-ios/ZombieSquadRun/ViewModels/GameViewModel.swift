import Foundation
import SwiftUI

@MainActor
final class GameViewModel: ObservableObject {
    @Published var stats = RunStats()
    @Published var encounters: [Encounter] = []
    @Published var gameOver = false
    @Published var paused = false
    @Published var statusMessage = "Tap a lane to shoot. Break walls before impact."

    private var tickTask: Task<Void, Never>?

    init() {
        startLoop()
    }

    deinit {
        tickTask?.cancel()
    }

    func restart() {
        stats = RunStats(bestDistance: stats.bestDistance)
        encounters = []
        gameOver = false
        paused = false
        statusMessage = "New run started."
    }

    func togglePause() {
        paused.toggle()
        statusMessage = paused ? "Paused" : "Back in the run"
    }

    func shoot(_ lane: Lane) {
        guard !paused, !gameOver else { return }

        guard let index = encounters.firstIndex(where: { $0.lane == lane }) else {
            statusMessage = "No target in the \(lane.title.lowercased()) lane."
            return
        }

        encounters[index].hitPoints -= stats.firepower
        if encounters[index].hitPoints <= 0 {
            resolveDestroyed(encounters[index])
            encounters.remove(at: index)
        } else {
            statusMessage = "Hit the target in the \(lane.title.lowercased()) lane."
        }
    }

    private func startLoop() {
        tickTask = Task {
            while !Task.isCancelled {
                try? await Task.sleep(for: .milliseconds(700))
                tick()
            }
        }
    }

    private func tick() {
        guard !paused, !gameOver else { return }

        stats.distance += 12
        stats.wave = max(1, 1 + stats.distance / 180)
        stats.bestDistance = max(stats.bestDistance, stats.distance)

        spawnIfNeeded()
        advanceEncounters()
    }

    private func spawnIfNeeded() {
        guard encounters.count < 3 else { return }
        let lane = Lane.allCases.randomElement() ?? .center
        let roll = Int.random(in: 0...99)
        if roll < 45 {
            encounters.append(Encounter(lane: lane, type: .zombie, hitPoints: Int.random(in: 1...3), reward: Int.random(in: 1...3), progress: 0))
        } else if roll < 75 {
            encounters.append(Encounter(lane: lane, type: .wall, hitPoints: Int.random(in: 2...max(4, 2 + stats.wave / 2)), reward: 0, progress: 0))
        } else {
            encounters.append(Encounter(lane: lane, type: .crate, hitPoints: 1, reward: 1, progress: 0))
        }
    }

    private func advanceEncounters() {
        for index in encounters.indices {
            encounters[index].progress += 0.18
        }

        let impacts = encounters.filter { $0.progress >= 1 }
        encounters.removeAll { $0.progress >= 1 }

        for impact in impacts {
            switch impact.type {
            case .wall:
                stats.squad -= impact.hitPoints
                statusMessage = "A wall held. Lost \(impact.hitPoints) squad members."
            case .zombie:
                stats.squad -= max(1, impact.reward - 1)
                statusMessage = "Zombies broke through."
            case .crate:
                break
            }
        }

        if stats.squad <= 0 {
            stats.squad = 0
            gameOver = true
            statusMessage = "Run over. Restart to try again."
        }
    }

    private func resolveDestroyed(_ encounter: Encounter) {
        switch encounter.type {
        case .zombie:
            stats.squad += encounter.reward
            statusMessage = "Saved survivors. Squad +\(encounter.reward)."
        case .crate:
            stats.firepower = min(6, stats.firepower + encounter.reward)
            statusMessage = "Firepower upgraded to \(stats.firepower)."
        case .wall:
            statusMessage = "Wall destroyed. Keep running."
        }
    }
}
