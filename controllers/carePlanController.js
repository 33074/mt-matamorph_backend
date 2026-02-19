const { generateCarePlan } = require('../services/carePlanService');

exports.generateWeeklyPlan = async (req, res) => {
  try {
    const { residentId } = req.params;

    const dailyPlan = await generateCarePlan(residentId);

    const week = {
      monday: dailyPlan,
      tuesday: dailyPlan,
      wednesday: dailyPlan,
      thursday: dailyPlan,
      friday: dailyPlan,
      saturday: dailyPlan,
      sunday: dailyPlan
    };

    res.json(week);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
