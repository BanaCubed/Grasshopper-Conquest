addLayer('forest', {
    row: 3,
    realm: 2,
    startData() { return {
        unlocked: true,
        wood: new Decimal(0),
        totalExp: new Decimal(0),
        growTime: new Decimal(1),
        points: new Decimal(0),
        arm: new Decimal(0),
        wea: new Decimal(0),
        autoW: true,
    }},
    update(diff) {
        player.forest.points = player.forest.points.add(tmp.forest.autoCut.mul(tmp.forest.woodOnCut).mul(diff));
        player.forest.totalExp = player.forest.totalExp.add(tmp.forest.expOnCut.mul(tmp.forest.autoCut).mul(diff));
        if(player.forest.wood.lt(tmp.forest.maxWood || player.forest.growTime.gt(0))) { player.forest.growTime = player.forest.growTime.sub(tmp.forest.woodSpeed.mul(diff)); }
        if(player.forest.wood.gte(tmp.forest.maxWood)) { player.forest.growTime  = player.forest.growTime.max(1); }
        if(player.forest.growTime.lt(0)) { player.forest.wood = player.forest.wood.add(player.forest.growTime.floor().mul(-1).mul(tmp.forest.woodPerGrow)).min(tmp.forest.maxWood); player.forest.growTime = player.forest.growTime.add(player.forest.growTime.floor().mul(-1)); }
    },
    automate() {
        if(hasFlauto('82') && player.forest.autoW) {
            buyMaxBuyable('forest', 11);
            buyMaxBuyable('forest', 12);
            buyMaxBuyable('forest', 13);
            buyMaxBuyable('forest', 14);
            buyMaxBuyable('forest', 15);
        }
    },
    color: 'var(--wood)',
    layerShown() { return hasMilestone('leag', 3) || player.evo.done },
    image: 'resources/forest-icon.webp',
    nodeStyle: {
        'background-size': 'contain',
        'background-color': 'hsl(105, 85%, 22.5%)',
        'border-color': 'var(--wood)',
    },
    tabFormat: {
        'Forest': {
            content: [
                ['raw-html', function(){return `You have <h2  class="overlayThing" id="points" style="color: var(--wood); text-shadow: var(--wood) 0px 0px 10px;">${formatWhole(player.forest.points.max(0))}</h2> wood`}],
                ['raw-html', function(){return `(${format(tmp.forest.woodOnCut)}/chop)` + (tmp.forest.autoCut.gt(0)?` | (${format(tmp.forest.woodOnCut.mul(tmp.forest.autoCut))}/sec)`:'')}],
                'blank',
                ['bar', 'level'],
                ['raw-html', function(){return `x${format(tmp.forest.levelEffect)} Grass/Tree grow speed, Tree Cap, Multicut/chop`}],
                'blank',
                ['clickable', 11],
                'blank',
                ['buyables', [1]],
                'blank',
            ],
            color: 'var(--wood)',
        },
        'Cabin': {
            content: [
                'cabin',
                'crafting',
                'blank',
            ],
            buttonStyle: {
                'border-color': 'var(--lood)',
                'background-color': 'var(--lood)',
            },
            color: 'var(--lood)',
            unlocked(){return getBuyableAmount('forest', 12).gte(1)},
        },
    },
    bars: {
        level: {
            direction: RIGHT,
            width: 550,
            height: 70,
            progress() { return player.forest.totalExp.sub(layers.forest.expForLevel()).div(tmp.forest.expToLevel) },
            display() {
                return `Naturality <h2 class="overlayThing" id="points" style="color: var(--wood); text-shadow: var(--wood) 0px 0px 10px, black 0px 0px 5px, black 0px 0px 5px, black 0px 0px 5px;">${formatWhole(tmp.forest.level.max(0))}</h2><br>
                ${formatWhole(player.forest.totalExp.sub(tmp.forest.expForLevel))}/${formatWhole(tmp.forest.expToLevel)} FP<br>
                (${format(tmp.forest.expOnCut)}/chop)` + (tmp.forest.autoCut.gt(0)?` | (${format(tmp.forest.expOnCut.mul(tmp.forest.autoCut))}/sec)`:'')
            },
            fillStyle: { 'background-image': 'url(resources/wood.webp)', },
            unlocked(){return tmp.forest.layerShown},
        },
    },
    clickables: {
        11: {
            title: 'Chop Tree',
            display() {
                return `There are ${formatWhole(player.forest.wood)}/${formatWhole(tmp.forest.maxWood)} Trees<br>Multichop: ${formatWhole(tmp.forest.multiCut)}/click<br>Autochop: ${formatWhole(tmp.forest.autoCut)}/sec<br>` + (player.forest.wood.gte(tmp.forest.maxWood)?`Forest is full`:`(${format(tmp.forest.woodPerGrow.mul(tmp.forest.woodSpeed))}/sec)`)
            },
            canClick() { return player.forest.wood.gte(1) },
            onClick() {
                let cuts = player.forest.wood.min(tmp.forest.multiCut);
                player.forest.wood = player.forest.wood.sub(tmp.forest.multiCut).max(0);
                player.forest.points = player.forest.points.add(tmp.forest.woodOnCut.mul(cuts));
                player.forest.totalExp = player.forest.totalExp.add(tmp.forest.expOnCut.mul(cuts));
            },
            style: {
                width: '150px',
                height: '150px',
            },
        },
        12: {
            title: 'Upgrade Armor',
            display() {
                return `Upgrade armor for ${tmp.forest.clickables[12].formatCost}<br>Upgrading armor doubles HP<br>${format(tmp.forest.clickables[12].progress)}% resources<br>Currently x${formatWhole(player.forest.arm.pow_base(2))} HP`
            },
            canClick() { return player.forest.points.gte(tmp.forest.clickables[12].cost[0]) && player.forest.arm==tmp.forest.clickables[12].stage },
            onClick() { 
                if(player.forest.arm!=tmp.forest.clickables[12].stage) { return }
                player.forest.points = player.forest.points.sub(tmp.forest.clickables[12].cost[0]);

                player.forest.arm = tmp.forest.clickables[12].stage.add(1);
            },
            style: {
                width: '300px',
                height: '90px',
                'min-height': '90px',
            },
            cost() {
                let costs = [
                    [new Decimal(1e7)],
                    [new Decimal(1e11)],
                    [new Decimal(1e18)],
                    [new Decimal(1e27)],
                    [Decimal.dInf],
                ]
                return costs[player.forest.arm.floor().toNumber()]
            },
            stage(){return player.forest.arm},
            formatCost() {
                if(player.forest.arm.lt(0.5)) { return formatWhole(1e7) + ' Wood' }
                if(player.forest.arm.lt(1.5)) { return formatWhole('1e11') + ' Wood' }
                if(player.forest.arm.lt(2.5)) { return formatWhole('1e18') + ' Wood' }
                if(player.forest.arm.lt(3.5)) { return formatWhole('1e27') + ' Wood' }
                if(player.forest.arm.lt(4.5)) { return formatWhole('1eeeeeee9') + ' Wood' }
            },
            progress() {
                if(player.forest.arm.lt(0.5)) { return player.forest.points.div(1e5).min(100).max(0) }
                if(player.forest.arm.lt(1.5)) { return player.forest.points.div(1e9).min(100).max(0) }
                if(player.forest.arm.lt(2.5)) { return player.forest.points.div(1e16).min(100).max(0) }
                if(player.forest.arm.lt(3.5)) { return player.forest.points.div(1e16).min(100).max(0) }
                if(player.forest.arm.lt(4.5)) { return new Decimal(0) }
            },
            names: ['N/A', 'Stool', 'Plank', 'Wooden Decoy', 'Hay Decoy', 'placeholder'],
            bgCol: "var(--ghop)",
        },
        13: {
            title: 'Upgrade Weapon',
            display() {
                return `Upgrade weapon for ${tmp.forest.clickables[13].formatCost}<br>Upgrading weapon doubles DMG<br>${format(tmp.forest.clickables[13].progress)}% resources<br>Currently x${formatWhole(player.forest.wea.pow_base(2))} DMG`
            },
            canClick() { return player.forest.points.gte(tmp.forest.clickables[13].cost[0]) && player.forest.wea==tmp.forest.clickables[13].stage },
            onClick() {
                if(player.forest.wea!=tmp.forest.clickables[13].stage) { return }
                player.forest.points = player.forest.points.sub(tmp.forest.clickables[13].cost[0]);

                player.forest.wea = tmp.forest.clickables[13].stage.add(1);
            },
            style: {
                width: '300px',
                height: '90px',
                'min-height': '90px',
            },
            cost() {
                let costs = [
                    [new Decimal(1e8)],
                    [new Decimal(1e12)],
                    [new Decimal(1e19)],
                    [new Decimal(1e27)],
                    [Decimal.dInf],
                ]
                return costs[player.forest.wea.floor().toNumber()]
            },
            stage(){return player.forest.wea},
            formatCost() {
                if(player.forest.wea.lt(0.5)) { return formatWhole(1e8) + ' Wood' }
                if(player.forest.wea.lt(1.5)) { return formatWhole('1e12') + ' Wood' }
                if(player.forest.wea.lt(2.5)) { return formatWhole('1e19') + ' Wood' }
                if(player.forest.wea.lt(3.5)) { return formatWhole('1e27') + ' Wood' }
                if(player.forest.wea.lt(4.5)) { return formatWhole('1eeeeeee9') + ' Wood' }
            },
            progress() {
                if(player.forest.wea.lt(0.5)) { return player.forest.points.div(1e6).min(100).max(0) }
                if(player.forest.wea.lt(1.5)) { return player.forest.points.div(1e10).min(100).max(0) }
                if(player.forest.wea.lt(2.5)) { return player.forest.points.div(1e17).min(100).max(0) }
                if(player.forest.wea.lt(3.5)) { return player.forest.points.div(1e27).min(100).max(0) }
                if(player.forest.wea.lt(4.5)) { return new Decimal(0) }
            },
            names: ['N/A', 'Pointy Stick', 'Wooden Mallet', 'Wooden Sword', 'Calcite Sword', 'placeholder'],
            bgCol: "var(--ghop)",
        },
    },
    buyables: {

        // Wood Upgrades
        11: {
            title: 'Bigger Trees',
            cost(x) { return x.pow_base(1.17).mul(10).ceil() },
            effect(x) { return x.add(1).mul(x.div(25).floor().pow_base(2)) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!hasFlauto('73')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost)}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(10).max(0.1).log(1.17).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!hasFlauto('73')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases wood gain by +100% per level<br>Every 25 doubles wood gain<br><br>Currently: x${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1000),
        },
        12: {
            title: 'Construction',
            cost(x) { return x.pow_base(1.25).mul(25).ceil() },
            effect(x) { return x.sub(1).div(20).max(0).add(1) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!hasFlauto('73')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost)}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(25).max(0.1).log(1.25).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!hasFlauto('73')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Build a cabin<br>Each level past 1 boosts cabin's boost to wood by +5%<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(50),
        },
        13: {
            title: 'Naturaler Trees',
            cost(x) { return x.pow_base(1.17).mul(1e4).ceil() },
            effect(x) { return x.add(1).mul(x.div(25).floor().pow_base(2)) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!hasFlauto('73')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost)}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(1e4).max(0.1).log(1.17).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!hasFlauto('73')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases Forest Points (FP) gain by +100% per level<br>Every 25 doubles FP gain<br><br>Currently: x${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1000),
        },
        14: {
            title: 'Construction II',
            cost(x) { return x.pow_base(1.5).mul(1e6).ceil() },
            effect(x) { return x.sub(1).div(8).max(0).add(1) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!hasFlauto('73')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost)}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(1e6).max(0.1).log(1.5).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!hasFlauto('73')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Build an extension to the Cabin<br>Each level past 1 boosts tree grow speed by +12.5%<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(800),
        },
        15: {
            title: 'Housing',
            cost(x) { return x.pow_base(1.1).mul(1e6).ceil() },
            effect(x) { return x.div(10).add(1).mul(x.div(10).floor().pow_base(1.1)) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!hasFlauto('73')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost)}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(1e6).max(0.1).log(1.1).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!hasFlauto('73')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases grasshopper gain by +10% per level<br>Every 10 boosts grasshopper gain by +10%<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1e5),
        },

    },
    doReset(layer) {
        if(tmp[layer].row <= tmp[this.layer].row) { return }
        let keep = []
        if(tmp[layer].realm != 0) { keep.push('arm', 'wea') }
        layerDataReset(this.layer, keep)
    },
    level() { return player.forest.totalExp.floor().div(50).max(0).add(1).log(2.5).pow(1.25).floor() },
    expForLevel(x = tmp.forest.level) { return x.pow(0.8).pow_base(2.5).sub(1).mul(50).ceil() },
    expToLevel() { return this.expForLevel(tmp.forest.level.add(1)).sub(this.expForLevel(tmp.forest.level)) },
    levelEffect() { return tmp.forest.level.pow(0.75).pow_base(1.5) },
    maxWood() {
        let max = new Decimal(5);
        max = max.mul(tmp.forest.levelEffect);
        return max.ceil();
    },
    woodPerGrow() {
        let gain = Decimal.dOne;
        return gain;
    },
    multiCut() {
        let cuts = Decimal.dOne;
        cuts = cuts.mul(tmp.forest.levelEffect);
        return cuts.floor().max(1);
    },
    woodOnCut() {
        let gain = Decimal.dOne;
        gain = gain.mul(tmp.forest.buyables[11].effect);
        gain = gain.mul(tmp.hop.sacRankEffect.pow(buyableEffect('forest', 12)));
        if(hasMilestone('leag', 5)) { gain = gain.mul(tmp.hop.milestones[2].effect.pow(0.15)) }
        return gain;
    },
    expOnCut() {
        let gain = new Decimal(1);
        gain = gain.mul(tmp.forest.buyables[13].effect);
        return gain;
    },
    woodSpeed() {
        let gain = Decimal.dOne;
        gain = gain.mul(tmp.forest.levelEffect);
        gain = gain.mul(tmp.forest.buyables[14].effect);
        return gain;
    },
    perksPerLevel() {
        let gain = Decimal.dOne;
        return gain
    },
    autoCut() {
        let cuts = Decimal.dZero;
        if(player.crys.flautomation.includes('63')) { cuts = cuts.add(100); }
        cuts = cuts.add(tmp.hop.clickables[26].effect);
        return cuts;
    },
})