$(document).ready(function () {
            var diameter = 960,
                height = 360,
                format = d3.format(",d"),
                color = d3.scale.category20c();

            var bubble = d3.layout.pack()
                .sort(null)
                .size([diameter, height])
                .padding(0);

            var svg = d3.select("#d3_space").append("svg")
                .attr("width", diameter)
                .attr("height", height)
                .attr("class", "bubble");

            d3.json("data.json", function (error, root) {
                var node = svg.selectAll(".node")
                    .data(bubble.nodes(classes(root))
                        .filter(function (d) {
                            return !d.children;
                        }))
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                        d.x = d.x + 100;
                        return "translate(" + d.x + "," + d.y + ")";
                    });

                node.append("title")
                    .text(function (d) {
                        return d.className + ": " + format(d.value);
                    });

                var node2 = node.append("circle")
                    .attr("r", 0)
                    .style("fill", function (d) {
                        return color(d.className);
                    });

                node2.transition()
                    .duration(600)
                    .attr("r", function (d) {
                        return d.r;
                    })
                    .ease("linear")

                node.append("text")
                    .attr("dy", ".3em")
                    .style("text-anchor", "middle")
                    .text(function (d) {
                        return d.className.substring(0, d.r / 3);
                    });
            });

            // Returns a flattened hierarchy containing all leaf nodes under the root.
            function classes(root) {
                var classes = [];

                function recurse(name, node) {
                    if (node.children) node.children.forEach(
                        function (child) {
                            recurse(node.name, child);
                        });
                    else classes.push({
                        packageName: name,
                        className: node.name,
                        value: node.size
                    });
                }

                recurse(null, root);
                return {
                    children: classes
                };
            }

            d3.select(self.frameElement).width();
        });