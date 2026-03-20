import SwiftUI

struct GameRootView: View {
    @StateObject private var viewModel = GameViewModel()

    var body: some View {
        ZStack {
            LinearGradient(colors: [Color.black, Color(red: 0.08, green: 0.12, blue: 0.2)], startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()

            VStack(spacing: 16) {
                StatsHeaderView(stats: viewModel.stats)
                EncounterBoardView(encounters: viewModel.encounters, shoot: viewModel.shoot)
                ControlPanelView(viewModel: viewModel)
            }
            .padding()
        }
    }
}

private struct StatsHeaderView: View {
    let stats: RunStats

    var body: some View {
        HStack(spacing: 12) {
            StatCard(title: "Squad", value: "\(stats.squad)")
            StatCard(title: "Firepower", value: "\(stats.firepower)")
            StatCard(title: "Distance", value: "\(stats.distance)")
            StatCard(title: "Wave", value: "\(stats.wave)")
        }
    }
}

private struct StatCard: View {
    let title: String
    let value: String

    var body: some View {
        VStack(spacing: 6) {
            Text(title.uppercased())
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(value)
                .font(.title.bold())
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 18))
    }
}

private struct EncounterBoardView: View {
    let encounters: [Encounter]
    let shoot: (Lane) -> Void

    var body: some View {
        HStack(spacing: 14) {
            ForEach(Lane.allCases) { lane in
                LaneView(lane: lane, encounter: encounters.first(where: { $0.lane == lane })) {
                    shoot(lane)
                }
            }
        }
    }
}

private struct LaneView: View {
    let lane: Lane
    let encounter: Encounter?
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 16) {
                Text(lane.title)
                    .font(.headline)
                    .foregroundStyle(.white)
                Spacer()
                if let encounter {
                    EncounterView(encounter: encounter)
                } else {
                    Text("Tap to shoot")
                        .foregroundStyle(.secondary)
                }
                Spacer()
            }
            .frame(maxWidth: .infinity, minHeight: 360)
            .padding()
            .background(Color.white.opacity(0.06))
            .clipShape(RoundedRectangle(cornerRadius: 24))
        }
        .buttonStyle(.plain)
    }
}

private struct EncounterView: View {
    let encounter: Encounter

    var body: some View {
        VStack(spacing: 14) {
            Text(icon)
                .font(.system(size: 82))
            Text(label)
                .font(.title3.bold())
                .foregroundStyle(.white)
            Text(detail)
                .foregroundStyle(.secondary)
            ProgressView(value: encounter.progress)
                .tint(tint)
        }
    }

    private var icon: String {
        switch encounter.type {
        case .zombie: return "🧟"
        case .wall: return "🧱"
        case .crate: return "📦"
        }
    }

    private var label: String {
        switch encounter.type {
        case .zombie: return "Zombie Pack"
        case .wall: return "Wall"
        case .crate: return "Gun Crate"
        }
    }

    private var detail: String {
        switch encounter.type {
        case .zombie: return "+\(encounter.reward) squad on clear"
        case .wall: return "Needs \(encounter.hitPoints) damage"
        case .crate: return "+\(encounter.reward) firepower"
        }
    }

    private var tint: Color {
        switch encounter.type {
        case .zombie: return .green
        case .wall: return .red
        case .crate: return .blue
        }
    }
}

private struct ControlPanelView: View {
    @ObservedObject var viewModel: GameViewModel

    var body: some View {
        VStack(spacing: 14) {
            Text(viewModel.statusMessage)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(.ultraThinMaterial)
                .clipShape(RoundedRectangle(cornerRadius: 18))

            HStack(spacing: 12) {
                Button("Restart") { viewModel.restart() }
                    .buttonStyle(.borderedProminent)
                Button(viewModel.paused ? "Resume" : "Pause") { viewModel.togglePause() }
                    .buttonStyle(.bordered)
            }

            if viewModel.gameOver {
                Text("Game Over")
                    .font(.title.bold())
                    .foregroundStyle(.red)
            }
        }
        .foregroundStyle(.white)
    }
}
